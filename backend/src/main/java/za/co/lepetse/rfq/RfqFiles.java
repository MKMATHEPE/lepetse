package za.co.lepetse.rfq;

import java.io.*;
import java.nio.file.*;
import java.net.URI;
import java.time.Duration;
import jakarta.annotation.PreDestroy;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.checksums.RequestChecksumCalculation;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import java.security.MessageDigest;
import java.util.*;
import java.util.zip.ZipInputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/** Untrusted uploads are quarantined outside web resources. No download route exists. */
@Component
class RfqFiles {
    private final Path root;
    private final S3Client r2;
    private final String bucket;

    RfqFiles(@Value("${lepetse.rfq.storage-directory}") String directory,
             @Value("${RFQ_STORAGE_MODE:local}") String mode,
             @Value("${R2_ACCOUNT_ID:}") String accountId,
             @Value("${R2_BUCKET:}") String bucket,
             @Value("${R2_ACCESS_KEY_ID:}") String accessKey,
             @Value("${R2_SECRET_ACCESS_KEY:}") String secretKey) {
        root = Path.of(directory).toAbsolutePath().normalize();
        this.bucket = bucket;
        if ("local".equals(mode)) {
            r2 = null;
            return;
        }
        if (!"r2".equals(mode) || !accountId.matches("[a-fA-F0-9]{32}")
                || bucket.isBlank() || accessKey.isBlank() || secretKey.isBlank()) {
            throw new IllegalStateException("Configure RFQ_STORAGE_MODE and all R2 storage settings.");
        }
        r2 = S3Client.builder()
                .endpointOverride(URI.create("https://" + accountId + ".r2.cloudflarestorage.com"))
                .region(Region.of("auto"))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .forcePathStyle(true)
                .serviceConfiguration(c -> c.chunkedEncodingEnabled(false))
                .requestChecksumCalculation(RequestChecksumCalculation.WHEN_REQUIRED)
                .overrideConfiguration(c -> c.apiCallTimeout(Duration.ofSeconds(30)))
                .build();
    }

    @PreDestroy
    void close() {
        if (r2 != null) r2.close();
    }

    record Upload(String name,String type,byte[] bytes,String digest) {}
    static String digest(byte[] bytes) {
        try {return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));}
        catch(Exception e){throw new IllegalStateException(e);}
    }
    List<Upload> validate(List<MultipartFile> files) throws IOException {
        if(files.size()>5)throw RfqService.bad("Attach no more than five documents.");
        var result=new ArrayList<Upload>();
        for(var file:files){
            if(file.isEmpty()||file.getSize()>10*1024*1024)throw RfqService.bad("Each document must be non-empty and no larger than 10 MB.");
            String name=Objects.toString(file.getOriginalFilename(),"").replace('\\','/');
            name=name.substring(name.lastIndexOf('/')+1);
            if(name.isBlank()||name.length()>200||name.chars().anyMatch(c->c<32))throw RfqService.bad("Check the document filename.");
            String extension=name.substring(name.lastIndexOf('.')+1).toLowerCase(Locale.ROOT);
            byte[] bytes=file.getBytes();
            String type=switch(extension){
                case "pdf" -> starts(bytes,new byte[]{37,80,68,70,45})?"application/pdf":null;
                case "png" -> starts(bytes,new byte[]{(byte)137,80,78,71,13,10,26,10})?"image/png":null;
                case "jpg","jpeg" -> starts(bytes,new byte[]{(byte)255,(byte)216,(byte)255})?"image/jpeg":null;
                case "xlsx","docx" -> officeType(bytes,extension);
                case "csv" -> validText(bytes)?"text/csv":null;
                default -> null;
            };
            if(type==null)throw RfqService.bad("A document does not match a supported PDF, spreadsheet, document or image format.");
            result.add(new Upload(name,type,bytes,digest(bytes)));
        }
        return result;
    }
    private boolean starts(byte[] value,byte[] prefix){return value.length>=prefix.length&&Arrays.equals(Arrays.copyOf(value,prefix.length),prefix);}
    private boolean validText(byte[] bytes){
        try {java.nio.charset.StandardCharsets.UTF_8.newDecoder().decode(java.nio.ByteBuffer.wrap(bytes));return bytes.length>0&&new String(bytes,java.nio.charset.StandardCharsets.UTF_8).chars().noneMatch(c->c==0);}
        catch(Exception e){return false;}
    }
    private String officeType(byte[] bytes,String extension) throws IOException {
        boolean content=false,document=false;int entries=0;long expanded=0;
        try(var zip=new ZipInputStream(new ByteArrayInputStream(bytes))){
            for(var entry=zip.getNextEntry();entry!=null;entry=zip.getNextEntry()){
                if(++entries>2000)throw RfqService.bad("The document contains too many embedded files.");
                if(entry.getName().equals("[Content_Types].xml"))content=true;
                if(entry.getName().equals(extension.equals("xlsx")?"xl/workbook.xml":"word/document.xml"))document=true;
                byte[] buffer=new byte[8192];int size;
                while((size=zip.read(buffer))!=-1)if((expanded+=size)>50*1024*1024)throw RfqService.bad("The document expands beyond the supported size.");
            }
        }catch(java.util.zip.ZipException e){return null;}
        return content&&document?(extension.equals("xlsx")?"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"application/vnd.openxmlformats-officedocument.wordprocessingml.document"):null;
    }
    String store(Upload upload) throws IOException {
        if (r2 != null) {
            String key = "rfq/" + UUID.randomUUID();
            try {
                r2.putObject(request -> request.bucket(bucket).key(key).contentType(upload.type()),
                        RequestBody.fromBytes(upload.bytes()));
                return key;
            } catch (software.amazon.awssdk.core.exception.SdkException e) {
                remove(key);
                throw new IOException("Could not store the RFQ attachment.", e);
            }
        }
        Files.createDirectories(root);
        boolean posix=Files.getFileStore(root).supportsFileAttributeView("posix");
        if(posix)Files.setPosixFilePermissions(root,java.nio.file.attribute.PosixFilePermissions.fromString("rwx------"));
        String key=UUID.randomUUID().toString();
        try {
            if(posix)Files.createFile(root.resolve(key),java.nio.file.attribute.PosixFilePermissions.asFileAttribute(java.nio.file.attribute.PosixFilePermissions.fromString("rw-------")));
            if(posix)Files.write(root.resolve(key),upload.bytes(),StandardOpenOption.WRITE);
            else Files.write(root.resolve(key),upload.bytes(),StandardOpenOption.CREATE_NEW);
        }
        catch(IOException e){remove(key);throw e;}
        return key;
    }
    void remove(String key) {
        try {
            if (key.startsWith("rfq/")) {
                if (r2 != null) r2.deleteObject(request -> request.bucket(bucket).key(key));
            } else {
                Files.deleteIfExists(root.resolve(UUID.fromString(key).toString()));
            }
        } catch (IOException | IllegalArgumentException | software.amazon.awssdk.core.exception.SdkException ignored) {
            // Cleanup is best effort. A failed upload must still fail the RFQ.
        }
    }
}
