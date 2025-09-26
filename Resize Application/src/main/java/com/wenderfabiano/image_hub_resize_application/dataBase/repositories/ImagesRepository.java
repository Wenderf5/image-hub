package com.wenderfabiano.image_hub_resize_application.dataBase.repositories;

import com.wenderfabiano.image_hub_resize_application.dataBase.enities.ImagesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImagesRepository extends JpaRepository<ImagesEntity, String> {
}
