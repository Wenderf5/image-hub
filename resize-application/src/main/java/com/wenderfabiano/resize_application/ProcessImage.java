package com.wenderfabiano.resize_application;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wenderfabiano.resize_application.DTOs.Message;
import com.wenderfabiano.resize_application.dataBase.enities.ImagesEntity;
import com.wenderfabiano.resize_application.dataBase.repositories.ImagesRepository;
import com.wenderfabiano.resize_application.exceptions.*;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import net.coobird.thumbnailator.Thumbnails;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.Duration;
import java.util.Base64;

@Component
public class ProcessImage {
    private final S3Client s3Client;
    private final ImagesRepository imagesRepository;
    private final RedisTemplate<String, String> redisTemplate;

    private final String bucketName = "image-hub";
    private final String prefixBucketUrl = "http://localhost:9000/" + bucketName + "/";

    public ProcessImage(
            S3Client s3Client,
            ImagesRepository imagesRepository,
            RedisTemplate<String, String> redisTemplate
    ) {
        this.s3Client = s3Client;
        this.imagesRepository = imagesRepository;
        this.redisTemplate = redisTemplate;
    }

    @RabbitListener(queues = "image-resize-queue")
    public void process(byte[] message) {
        String id;
        String fullName;
        String base64Image;

        try {
            Message deserializedMessage = deserializeMessage(message);
            id = deserializedMessage.getId();
            fullName = deserializedMessage.getFullName();
            base64Image = deserializedMessage.getBase64Image();
        } catch (Exception e) {
            return;
        }

        try {
            BufferedImage bufferedImage = base64ImageToBufferedImage(base64Image);
            BufferedImage resizedImage = resizeImage(bufferedImage);

            byte[] imageBytes = bufferedImageToByte(resizedImage);
            saveImageToBucket(bucketName, id + ":" + fullName, imageBytes);
            saveImageToDatabase(id, prefixBucketUrl + id + ":" + fullName);
            changeRedisStatus("resize:" + id, "200", Duration.ofMinutes(5));
        } catch (Exception e) {
            changeRedisStatus("resize:" + id, "400", Duration.ofMinutes(5));
        }
    }

    private Message deserializeMessage(byte[] message) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(message);
            String id = node.get("data").get("id").asText();
            String fullName = node.get("data").get("fullName").asText();
            String base64Image = node.get("data").get("image").asText();
            Message msg = new Message(id, fullName, base64Image);

            return msg;
        } catch (Exception e) {
            throw new MessageDeserializationException("Error deserializing message from queue");
        }
    }

    private BufferedImage base64ImageToBufferedImage(String base64Image) {
        try {
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);
            ByteArrayInputStream bais = new ByteArrayInputStream(imageBytes);
            BufferedImage bufferedImage = ImageIO.read(bais);

            return bufferedImage;
        } catch (Exception e) {
            throw new Base64ImageToBufferedImageException("Error converting base64 image to bufferedImage");
        }
    }

    private BufferedImage resizeImage(BufferedImage image) {
        try {
            BufferedImage resizedImage = Thumbnails.of(image)
                    .size(200, 200)
                    .asBufferedImage();

            return resizedImage;
        } catch (Exception e) {
            throw new ResizeImageException("Error resizing image");
        }
    }

    private byte[] bufferedImageToByte(BufferedImage image) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            byte[] imageBytes = baos.toByteArray();

            return imageBytes;
        } catch (Exception e) {
            throw new BufferedImageToByteException("Error converting bufferedImage to byte");
        }
    }

    private void saveImageToBucket(String bucketName, String key, byte[] object) {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            RequestBody requestBody = RequestBody
                    .fromBytes(object);

            this.s3Client.putObject(putObjectRequest, requestBody);
        } catch (Exception e) {
            throw new SaveImageToBucketException("Error saving image to bucket");
        }
    }

    private void saveImageToDatabase(String id, String url) {
        try {
            ImagesEntity image = new ImagesEntity(id, url);
            this.imagesRepository.save(image);
        } catch (Exception e) {
            throw new SavaImageToDadaBaseException("Error saving image url to database");
        }
    }

    private void changeRedisStatus(String key, String value, Duration TTL) {
        this.redisTemplate.opsForValue().set(key, value, TTL);
    }
}
