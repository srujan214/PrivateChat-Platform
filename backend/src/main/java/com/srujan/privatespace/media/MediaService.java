package com.srujan.privatespace.media;

import com.srujan.privatespace.media.dto.UploadResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class MediaService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    public UploadResponse save(MultipartFile file) throws IOException {
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);

        String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String ext = "";
        int i = original.lastIndexOf('.');
        if (i >= 0) ext = original.substring(i);

        String stored = UUID.randomUUID() + ext;
        Path target = dir.resolve(stored);
        Files.copy(file.getInputStream(), target);

        return new UploadResponse(
                "/uploads/" + stored,
                original,
                file.getSize(),
                file.getContentType()
        );
    }
}