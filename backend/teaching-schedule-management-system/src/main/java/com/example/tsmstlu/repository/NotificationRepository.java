package com.example.tsmstlu.repository;

import com.example.tsmstlu.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

    @Query("SELECT n FROM NotificationEntity n " +
            "JOIN n.recipients r " +
            "JOIN r.user u " +
            "WHERE u.username = :username")
    List<NotificationEntity> findByRecipientUsername(@Param("username") String username);

}
