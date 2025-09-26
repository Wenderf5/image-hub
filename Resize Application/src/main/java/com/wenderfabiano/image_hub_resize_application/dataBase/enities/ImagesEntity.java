package com.wenderfabiano.image_hub_resize_application.dataBase.enities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "images")
@NoArgsConstructor
@AllArgsConstructor
public class ImagesEntity {
    @Id
    @Getter
    @Column(name = "id")
    private String id;

    @Getter
    @Column(name = "image_url", unique = true, nullable = false)
    private String image_url;
}
