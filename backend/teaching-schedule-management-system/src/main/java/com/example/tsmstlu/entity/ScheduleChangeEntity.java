    package com.example.tsmstlu.entity;

    import com.example.tsmstlu.common.TableNameContants;
    import jakarta.persistence.*;
    import lombok.*;
    import lombok.experimental.SuperBuilder;
    import java.util.Date;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @SuperBuilder
    @EqualsAndHashCode(callSuper = true)
    @Entity
    @Table(name = TableNameContants.SCHEDULE_CHANGE)
    public class ScheduleChangeEntity extends BaseEntity{
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(optional = false)
        @JoinColumn(name = "teaching_schedule_detail_id", nullable = false)
        private TeachingScheduleDetailEntity teachingScheduleDetail;

        private String type;
        private String reason;

        @Column(name = "lecture_content")
        private String lectureContent;

        @Column(name = "new_date")
        private Date newDate;

        @ManyToOne(optional = true)
        @JoinColumn(name = "new_room_id")
        private RoomEntity newRoom;

        @Column(name = "file_url")
        private String fileUrl;

        @Column(name = "new_period_start")
        private Integer newPeriodStart;

        @Column(name = "new_period_end")
        private Integer newPeriodEnd;

        private String status;
    }