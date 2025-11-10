package com.example.tsmstlu.config;

import com.example.tsmstlu.entity.UserEntity;
import com.example.tsmstlu.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

   @Bean
   CommandLineRunner initDefaultUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
       return args -> {
           if (userRepository.findByUsername("admin").isEmpty()) {
               UserEntity user = new UserEntity();
               user.setUsername("admin");
               user.setPassword(passwordEncoder.encode("123456"));
               user.setRole("ROLE_ADMIN");

               userRepository.save(user);
               System.out.println("✅ Default admin user created.");
           } else {
               System.out.println("ℹ️ Default admin user already exists.");
           }
       };
   }
}