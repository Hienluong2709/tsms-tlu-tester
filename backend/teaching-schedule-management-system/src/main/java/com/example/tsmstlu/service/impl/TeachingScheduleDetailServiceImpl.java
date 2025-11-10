package com.example.tsmstlu.service.impl;

import com.example.tsmstlu.dto.teaching_schedule_detail.TeachingScheduleDetailDto;
import com.example.tsmstlu.entity.TeachingScheduleDetailEntity;
import com.example.tsmstlu.utils.MapperUtils;
import com.example.tsmstlu.repository.TeachingScheduleDetailRepository;
import com.example.tsmstlu.service.TeachingScheduleDetailService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeachingScheduleDetailServiceImpl implements TeachingScheduleDetailService {

    private final TeachingScheduleDetailRepository detailRepository;
    private final MapperUtils mapperUtils;

    @Override
    @Transactional
    @CachePut(value = "teachingScheduleDetailCache", key = "#detailId")
    @CacheEvict(value = "teachingScheduleDetailCache", key = "'all'")
    public TeachingScheduleDetailDto markAttendance(Long detailId) {
        TeachingScheduleDetailEntity entity = detailRepository.findById(detailId)
                .orElseThrow(() -> new EntityNotFoundException("Detail not found with id: " + detailId));

        if ("DA_DAY".equals(entity.getStatus())) {
            throw new IllegalStateException("Buổi học này đã được chấm công rồi");
        }

        entity.setStatus("DA_DAY");
        detailRepository.save(entity);

        return mapperUtils.toTeachingScheduleDetailDto(entity);
    }
}
