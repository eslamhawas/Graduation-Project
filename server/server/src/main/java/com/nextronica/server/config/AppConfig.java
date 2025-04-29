package com.nextronica.server.config;


import com.nextronica.server.dtos.UserDto;
import com.nextronica.server.models.User;
import com.nextronica.server.providers.Auth.AuthInterceptor;
import org.modelmapper.ModelMapper;
import org.modelmapper.record.RecordModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig implements WebMvcConfigurer {
    private final AuthInterceptor authInterceptor;

    public AppConfig(AuthInterceptor authInterceptor) {
        this.authInterceptor = authInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:4201", "https://your-production-domain.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper().registerModule(new RecordModule());
        modelMapper.createTypeMap(User.class, UserDto.class)
                .setConverter(context -> {
                    User source = context.getSource();
                    return new UserDto(
                            source.getUsername(),
                            source.getEmail(),
                            source.getFullName(),
                            source.getPhoneNumber(),
                            source.getRoles(),
                            source.getStatus(),
                            source.getProfileImageUrl(),
                            source.getBio(),
                            source.getId(),
                            source.getBirthday()
                    );
                });
        modelMapper.validate();
        return modelMapper;
    }
}