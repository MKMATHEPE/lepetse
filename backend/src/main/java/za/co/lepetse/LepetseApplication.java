package za.co.lepetse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@org.springframework.scheduling.annotation.EnableScheduling
@SpringBootApplication
public class LepetseApplication {
    public static void main(String[] args) {
        SpringApplication.run(LepetseApplication.class, args);
    }
}
