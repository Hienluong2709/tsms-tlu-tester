package com.example.tsmstlu.service;

import com.example.tsmstlu.dto.user.UserCreateDto;
import com.example.tsmstlu.dto.user.UserDto;
import com.example.tsmstlu.entity.UserEntity;

public interface UserService extends BaseService<UserEntity, UserDto, UserDto, UserCreateDto, UserCreateDto, Long> {
}
