package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.service.BaseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.cache.annotation.CacheConfig;
//import org.springframework.cache.annotation.CacheEvict;
//import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
//@CacheConfig(cacheNames = "defaultCache")
public abstract class BaseServiceImpl<T, ListDto, DetailDto, CreateDto, UpdateDto, ID>
        implements BaseService<T, ListDto, DetailDto, CreateDto, UpdateDto, ID> {

    protected final JpaRepository<T, ID> repository;

    protected abstract ListDto toListDto(T entity);
    protected abstract DetailDto toDetailDto(T entity);
    protected abstract T fromCreateDto(CreateDto dto);
    protected abstract T fromUpdateDto(UpdateDto dto);
    protected abstract void setId(T entity, ID id);
    protected abstract String getEntityName();

//    @Cacheable(
//            cacheNames = "#{T(java.lang.String).format('%sList', this.getEntityName())}",
//            unless = "#result == null"
//    )
    @Override
    public List<ListDto> getAll() {
        log.info("Fetching all from DB for entity: {}", getEntityName());
        return repository.findAll().stream()
                .map(this::toListDto)
                .collect(Collectors.toList());
    }

//    @Cacheable(
//            cacheNames = "#{T(java.lang.String).format('%sById', this.getEntityName())}",
//            key = "#id",
//            unless = "#result == null"
//    )
    @Override
    public DetailDto getById(ID id) {
        log.info("Fetching by ID from DB: {} - {}", getEntityName(), id);
        Optional<T> optional = repository.findById(id);
        return optional.map(this::toDetailDto).orElse(null);
    }

//    @CacheEvict(cacheNames = {
//            "#{T(java.lang.String).format('%sList', this.getEntityName())}"
//    }, allEntries = true)
    @Override
    public DetailDto create(CreateDto dto) {
        T entity = fromCreateDto(dto);
        log.info("Creating new entity: {}", getEntityName());
        return toDetailDto(repository.save(entity));
    }

//    @CacheEvict(cacheNames = {
//            "#{T(java.lang.String).format('%sList', this.getEntityName())}",
//            "#{T(java.lang.String).format('%sById', this.getEntityName())}"
//    }, key = "#id", allEntries = true)
    @Override
    public DetailDto update(ID id, UpdateDto dto) {
        if (!repository.existsById(id)) {
            log.warn("Update failed: {} with id {} not found.", getEntityName(), id);
            return null;
        }
        T entity = fromUpdateDto(dto);
        setId(entity, id);
        log.info("Updating entity: {} - {}", getEntityName(), id);
        return toDetailDto(repository.save(entity));
    }

//    @CacheEvict(cacheNames = {
//            "#{T(java.lang.String).format('%sList', this.getEntityName())}",
//            "#{T(java.lang.String).format('%sById', this.getEntityName())}"
//    }, key = "#id", allEntries = true)
    @Override
    public void delete(ID id) {
        if (repository.existsById(id)) {
            log.info("Deleting entity: {} - {}", getEntityName(), id);
            repository.deleteById(id);
        } else {
            log.warn("Delete failed: {} with id {} not found.", getEntityName(), id);
        }
    }
}
