package za.co.lepetse.admin;

import java.util.Arrays;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/** Run locally in a terminal. Password entry is hidden and never sent anywhere. */
public class AdminPasswordHash {
    public static void main(String[] args){
        var console=System.console();
        if(console==null)throw new IllegalStateException("Run this utility in an interactive terminal.");
        char[] first=console.readPassword("New admin password (at least 14 characters): ");
        char[] second=console.readPassword("Confirm password: ");
        try{
            if(first==null||second==null||first.length<14||!Arrays.equals(first,second))throw new IllegalArgumentException("Passwords must match and contain at least 14 characters.");
            console.printf("%s%n",new BCryptPasswordEncoder(12).encode(new String(first)));
        }finally{if(first!=null)Arrays.fill(first,'\0');if(second!=null)Arrays.fill(second,'\0');}
    }
}
