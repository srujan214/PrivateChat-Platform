package com.srujan.privatespace.media.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UploadResponse {
    private String url;
    private String fileName;
    private long size;
    private String contentType;
}