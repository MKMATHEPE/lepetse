package za.co.lepetse.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminLoginPage {
    @GetMapping({"/admin/login", "/admin/login/"})
    public String login() {
        return "redirect:/admin/login.html";
    }
}
