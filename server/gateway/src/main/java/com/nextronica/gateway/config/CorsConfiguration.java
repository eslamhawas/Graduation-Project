package com.nextronica.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.cors.reactive.CorsUtils;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
public class CorsConfiguration {

    private static final String ALLOWED_HEADERS = "x-requested-with, authorization, Content-Type, Authorization, credential, X-XSRF-TOKEN";
    private static final String ALLOWED_METHODS = "GET, PUT, POST, DELETE, OPTIONS, PATCH";
    private static final String ALLOWED_ORIGIN = "http://127.0.0.1:5500,http://localhost:4200,http://localhost:4201,http://localhost:5173";
    private static final String MAX_AGE = "3600";

    @Bean
    public WebFilter corsFilter() {
        return (ServerWebExchange ctx, WebFilterChain chain) -> {
            ServerHttpRequest request = ctx.getRequest();

            if (CorsUtils.isCorsRequest(request)) {
                ServerHttpResponse response = ctx.getResponse();
                HttpHeaders headers = response.getHeaders();

                // Clear any existing CORS headers to prevent duplicates
                headers.remove("Access-Control-Allow-Origin");
                headers.remove("Access-Control-Allow-Methods");
                headers.remove("Access-Control-Max-Age");
                headers.remove("Access-Control-Allow-Headers");
                headers.remove("Access-Control-Allow-Credentials");
                headers.remove("Access-Control-Expose-Headers");

                String origin = request.getHeaders().getOrigin();
                if (origin != null && ALLOWED_ORIGIN.contains(origin)) {
                    headers.add("Access-Control-Allow-Origin", origin);
                }

                headers.add("Access-Control-Allow-Methods", ALLOWED_METHODS);
                headers.add("Access-Control-Max-Age", MAX_AGE);
                headers.add("Access-Control-Allow-Headers", ALLOWED_HEADERS);
                headers.add("Access-Control-Allow-Credentials", "true");
                headers.add("Access-Control-Expose-Headers", "Authorization, Content-Type, Content-Disposition");

                if (request.getMethod() == HttpMethod.OPTIONS) {
                    response.setStatusCode(HttpStatus.OK);
                    return Mono.empty();
                }
            }

            return chain.filter(ctx);
        };
    }
}