package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.notification.*;
import com.example.tsmstlu.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/notifications")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public NotificationDto create(@RequestBody NotificationCreateRequestDto request) {
        return notificationService.createNotification(request);
    }

    @GetMapping
    public List<NotificationDto> getAll() {
        return notificationService.getAll();
    }
}
