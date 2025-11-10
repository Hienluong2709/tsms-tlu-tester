package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.room.RoomCreateDto;
import com.example.tsmstlu.dto.room.RoomDto;
import com.example.tsmstlu.dto.room.RoomListDto;
import com.example.tsmstlu.dto.room.RoomUpdateDto;
import com.example.tsmstlu.entity.RoomEntity;
import com.example.tsmstlu.repository.RoomRepository;
import com.example.tsmstlu.service.RoomService;
import com.example.tsmstlu.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final MapperUtils mapper;

    @Override
    @Cacheable(value = "roomCache", key = "'all'")
    public List<RoomListDto> getAll() {
        return roomRepository.findAll()
                .stream()
                .map(mapper::toRoomListDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "roomCache", key = "#id")
    public RoomDto getById(Long id) {
        RoomEntity entity = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + id));
        return mapper.toRoomDetailDto(entity);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "roomCache", key = "'all'"),
            @CacheEvict(value = "roomCache", allEntries = true)
    })
    public RoomDto create(RoomCreateDto roomCreateDto) {
        RoomEntity entity = mapper.toRoomEntity(roomCreateDto);
        RoomEntity saved = roomRepository.save(entity);
        return mapper.toRoomDetailDto(saved);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "roomCache", key = "#id"),
            @CacheEvict(value = "roomCache", key = "'all'")
    })
    public RoomDto update(Long id, RoomUpdateDto roomUpdateDto) {
        RoomEntity entity = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + id));

        mapper.copyEntity(roomUpdateDto, entity);
        RoomEntity updated = roomRepository.save(entity);
        return mapper.toRoomDetailDto(updated);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "roomCache", key = "#id"),
            @CacheEvict(value = "roomCache", key = "'all'")
    })
    public void delete(Long id) {
        if(!roomRepository.existsById(id)) {
            throw new EntityNotFoundException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
        log.info("Room with id {} deleted successfully", id);
    }
}
