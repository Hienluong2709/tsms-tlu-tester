package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.room.RoomCreateDto;
import com.example.tsmstlu.dto.room.RoomDto;
import com.example.tsmstlu.dto.room.RoomListDto;
import com.example.tsmstlu.dto.room.RoomUpdateDto;
import com.example.tsmstlu.entity.RoomEntity;
import com.example.tsmstlu.service.RoomService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/rooms")
@PreAuthorize("hasRole('ADMIN')")
public class RoomController extends BaseController<RoomEntity, RoomListDto, RoomDto, RoomCreateDto, RoomUpdateDto, Long> {

    public RoomController(RoomService roomService) {
        super(roomService);
    }
}
