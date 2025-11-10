package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.user.UserCreateDto;
import com.example.tsmstlu.dto.user.UserDto;
import com.example.tsmstlu.entity.UserEntity;
import com.example.tsmstlu.repository.UserRepository;
import com.example.tsmstlu.service.UserService;
import com.example.tsmstlu.utils.MapperUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends BaseServiceImpl<UserEntity,UserDto,UserDto,UserCreateDto,UserCreateDto,Long> implements UserService {

    private final MapperUtils mapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository repository, MapperUtils mapper, PasswordEncoder passwordEncoder) {
        super(repository);
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected UserDto toListDto(UserEntity entity) {
        return mapper.toUserDto(entity);
    }

    @Override
    protected UserDto toDetailDto(UserEntity entity) {
        return mapper.toUserDto(entity);
    }

    @Override
    protected UserEntity fromCreateDto(UserCreateDto dto) {
        UserEntity entity = mapper.toEntity(dto);
        entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        return entity;
    }

    @Override
    protected UserEntity fromUpdateDto(UserCreateDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void setId(UserEntity entity, Long id) {
        entity.setId(id);
    }

    @Override
    protected String getEntityName() {
        return "users";
    }
}
