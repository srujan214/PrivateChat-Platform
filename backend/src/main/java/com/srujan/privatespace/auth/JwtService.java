package com.srujan.privatespace.auth;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    public String generateToken(String username) {
        try {
            byte[] secretBytes = padSecret(secret);
            JWSSigner signer = new MACSigner(secretBytes);

            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .subject(username)
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + expiration))
                    .build();

            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
            signedJWT.sign(signer);
            return signedJWT.serialize();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate token", e);
        }
    }

    public String extractUsername(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Invalid token", e);
        }
    }

    public boolean isValid(String token) {
        try {
            byte[] secretBytes = padSecret(secret);
            SignedJWT signedJWT = SignedJWT.parse(token);
            MACVerifier verifier = new MACVerifier(secretBytes);

            boolean signatureOk = signedJWT.verify(verifier);
            boolean notExpired = signedJWT.getJWTClaimsSet()
                    .getExpirationTime()
                    .after(new Date());

            return signatureOk && notExpired;
        } catch (Exception e) {
            return false;
        }
    }

    private byte[] padSecret(String raw) {
        byte[] bytes = raw.getBytes();
        if (bytes.length >= 32) return bytes;
        byte[] padded = new byte[32];
        System.arraycopy(bytes, 0, padded, 0, bytes.length);
        return padded;
    }
}