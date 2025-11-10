package com.example.tsmstlu.controller.teacher;

import com.example.tsmstlu.dto.notification.UserNotificationDto;
import com.example.tsmstlu.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/notifications")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherNotificationController {

    private final NotificationService notificationService;

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
