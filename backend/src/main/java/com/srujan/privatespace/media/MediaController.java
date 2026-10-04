package com.srujan.privatespace.media;

import com.srujan.privatespace.common.ApiResponse;
import com.srujan.privatespace.media.dto.UploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    public ApiResponse<UploadResponse> upload(@RequestParam("file") MultipartFile file)
            throws IOException {
        return ApiResponse.ok("Uploaded", mediaService.save(file));
    }
}