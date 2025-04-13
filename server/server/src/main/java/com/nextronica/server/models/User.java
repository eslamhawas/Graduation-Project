package com.nextronica.server.models;

import com.nextronica.server.models.enums.Roles;
import com.nextronica.server.models.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(
        name = "users",
        indexes = {
                @Index(name = "idx_user_email", columnList = "email"),
                @Index(name = "idx_user_username", columnList = "username"),
                @Index(name = "idx_user_status", columnList = "status")
        }
)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = {"id", "email"})
@ToString(exclude = {"passwordHash", "passwordSalt"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(
            regexp = "^[a-zA-Z0-9._-]+$",
            message = "Username can only contain letters, numbers, dots, underscores, and hyphens"
    )
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Must be a valid email address")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "Password hash cannot be blank")
    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false,length = 255)
    private String passwordSalt;

    @NotBlank(message = "Full name cannot be blank")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Pattern(
            regexp = "^[\\p{L}\\s.-]+$",
            message = "Full name can only contain letters, spaces, dots, and hyphens"
    )
    @Column(nullable = false, length = 100)
    private String fullName;


    @Column(length = 20)
    private String phoneNumber;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            indexes = @Index(name = "idx_user_roles", columnList = "user_id, role"),
            foreignKey = @ForeignKey(name = "fk_user_roles_user",
                    foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @Builder.Default
    private Set<Roles> roles = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.ACTIVE;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime lastLogin;
    private LocalDateTime lastPasswordChange;
    private LocalDateTime lastStatusChange;

    @Column(nullable = false)
    @Builder.Default
    private boolean isEmailVerified = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean isPhoneVerified = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean twoFactorEnabled = false;


    @Column(nullable = false)
    private LocalDate birthday;

    @Size(max = 255)
//    @Pattern(
//            regexp = "^(https?:\\/\\/)?[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$",
//            message = "Must be a valid URL"
//    )
    private String profileImageUrl;

    @Column(length = 500)
    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    private String bio;

    @Version
    private Long version;

    @Transient
    private Status previousStatus;

    @PrePersist
    protected void onCreate() {
        if (roles.isEmpty()) {
            roles.add(Roles.USER);
        }
        if (status == null) {
            status = Status.PENDING_VERIFICATION;
        }
        lastStatusChange = LocalDateTime.now();
    }

    @PostLoad
    private void cachePreviousStatus() {
        this.previousStatus = this.status;
    }

    @PreUpdate
    protected void onUpdate() {
        if (this.previousStatus != null && this.status != null) {
            if (!this.previousStatus.equals(this.status)) {
                this.lastStatusChange = LocalDateTime.now();
            }
        }
        this.previousStatus = this.status;
    }

    public boolean hasRole(Roles roles) {
        return this.roles.contains(roles);
    }

    public boolean isBanned() {
        return this.status.equals(Status.SUSPENDED);
    }
}