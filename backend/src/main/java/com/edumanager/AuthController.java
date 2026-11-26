package com.edumanager;

import java.time.Instant;
import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtEncoder encoder;

    public AuthController(AuthenticationManager authenticationManager, JwtEncoder encoder) {
        this.authenticationManager = authenticationManager;
        this.encoder = encoder;
    }

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}
    public record UserView(String username, String role) {}
    public record LoginResponse(String token, UserView user, Instant expiresAt) {}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication user;
        try {
            user = authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(request.username(), request.password()));
        } catch (AuthenticationException failure) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides");
        }

        Instant now = Instant.now();
        Instant expires = now.plusSeconds(900);
        List<String> roles = user.getAuthorities().stream()
                .map(authority -> authority.getAuthority().substring("ROLE_".length())).toList();
        JwtClaimsSet claims = JwtClaimsSet.builder().issuer(SecurityConfig.ISSUER).subject(user.getName())
                .issuedAt(now).expiresAt(expires).claim("roles", roles).build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
                .body(new LoginResponse(token, new UserView(user.getName(), roles.get(0)), expires));
    }
}
