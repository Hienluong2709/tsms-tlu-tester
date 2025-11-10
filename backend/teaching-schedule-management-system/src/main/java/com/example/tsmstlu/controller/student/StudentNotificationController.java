package com.example.tsmstlu.controller.student;

import com.example.tsmstlu.dto.notification.NotificationDto;
import com.example.tsmstlu.dto.notification.UserNotificationDto;
import com.example.tsmstlu.service.NotificationService;
import com.example.tsmstlu.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/notifications")
@RequiredArgsConstructor
public class StudentNotificationController {

    private final NotificationService notificationService;
    private final JwtUtils jwtUtils;

    @GetMapping
    public ResponseEntity<List<UserNotificationDto>> getMyNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User userDetails = (User) authentication.getPrincipal();

        List<UserNotificationDto> notifications = notificationService.getByUsername(userDetails.getUsername());
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/read/{notificationId}")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId, Authentication authentication) {
        String username = authentication.getName();
        notificationService.markAsReadByNotificationId(notificationId, username);
        return ResponseEntity.noContent().build();
    }
}
