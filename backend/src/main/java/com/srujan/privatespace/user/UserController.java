package com.srujan.privatespace.user;

import com.srujan.privatespace.common.ApiResponse;
import com.srujan.privatespace.user.dto.ProfileResponse;
import com.srujan.privatespace.user.dto.UpdateProfileRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<ProfileResponse> me(Authentication auth) {
        return ApiResponse.ok(userService.getProfile(auth.getName()));
    }

    @PutMapping("/me")
    public ApiResponse<ProfileResponse> update(Authentication auth,
                                               @RequestBody UpdateProfileRequest req) {
        return ApiResponse.ok(userService.updateProfile(auth.getName(), req));
    }

    @GetMapping("/{username}")
    public ApiResponse<ProfileResponse> getByUsername(@PathVariable String username) {
        return ApiResponse.ok(userService.getProfile(username));
    }
}