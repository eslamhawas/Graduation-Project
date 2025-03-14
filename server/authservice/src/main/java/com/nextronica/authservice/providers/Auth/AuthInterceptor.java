package com.nextronica.authservice.providers.Auth;

import com.nextronica.authservice.models.enums.Roles;
import com.nextronica.authservice.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Set;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    private final JwtUtil jwtUtil;

    public AuthInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        Auth auth = handlerMethod.getMethodAnnotation(Auth.class);
        if (auth == null) {
            return true;
        }

        String token = jwtUtil.extractToken(request);
        String username = jwtUtil.extractUsername(token);
        if (token == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        if (!jwtUtil.validateToken(token, username)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        String[] requiredRoles = auth.roles();
        if (requiredRoles != null && requiredRoles.length > 0) {
            Claims claims = jwtUtil.extractAllClaims(token);
            Set<Roles> userRoles = claims.get("roles", Set.class);
            if (!hasRequiredRole(userRoles, requiredRoles)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return false;
            }
        }

        return true;
    }


    private boolean hasRequiredRole(Set<Roles> userRoles, String[] roles) {
        for (String role : roles) {
            if (userRoles.contains(Roles.valueOf(role))) {
                return true;
            }
        }
        return false;
    }
}
