package com.wenderfabiano.resize_application.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Message {
    private String id;
    private String fullName;
    private String base64Image;
}
