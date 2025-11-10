package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.dto.user.UserCreateDto;
import com.example.tsmstlu.dto.user.UserDto;
import com.example.tsmstlu.entity.UserEntity;
import com.example.tsmstlu.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")

public class UserController extends BaseController<UserEntity, UserDto,UserDto,UserCreateDto, UserCreateDto, Long> {
    public UserController(UserService userService) {
        super(userService);
    }
}
