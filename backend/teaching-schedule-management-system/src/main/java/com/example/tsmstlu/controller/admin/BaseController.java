package com.example.tsmstlu.controller.admin;

import com.example.tsmstlu.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RequiredArgsConstructor
@RestController
public abstract class BaseController<T, ListDto, DetailDto, CreateDto, UpdateDto, ID> {

    protected final BaseService<T, ListDto, DetailDto, CreateDto, UpdateDto, ID> service;

    @GetMapping
    public ResponseEntity<List<ListDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetailDto> getById(@PathVariable ID id) {
        DetailDto result = service.getById(id);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<DetailDto> create(@RequestBody CreateDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetailDto> update(@PathVariable ID id, @RequestBody UpdateDto dto) {
        DetailDto result = service.update(id, dto);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
