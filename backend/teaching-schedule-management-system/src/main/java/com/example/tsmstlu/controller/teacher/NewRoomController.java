package com.example.tsmstlu.controller.teacher;

import com.example.tsmstlu.dto.room.RoomListDto;
import com.example.tsmstlu.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/new-room")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class NewRoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<RoomListDto>> getAll() {
        return ResponseEntity.ok(roomService.getAll());
    }
}
