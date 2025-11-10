package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.room.RoomCreateDto;
import com.example.tsmstlu.dto.room.RoomDto;
import com.example.tsmstlu.dto.room.RoomListDto;
import com.example.tsmstlu.dto.room.RoomUpdateDto;
import com.example.tsmstlu.entity.RoomEntity;

public interface RoomService extends BaseService<RoomEntity, RoomListDto, RoomDto, RoomCreateDto, RoomUpdateDto, Long> {
}
