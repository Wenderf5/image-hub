package com.wenderfabiano.resize_application.dataBase.repositories;

import com.wenderfabiano.resize_application.dataBase.enities.ImagesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImagesRepository extends JpaRepository<ImagesEntity, String> {
}
