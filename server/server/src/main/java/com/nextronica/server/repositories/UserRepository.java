package com.nextronica.server.repositories;


import com.nextronica.server.models.User;
import com.nextronica.server.models.enums.Roles;
import com.nextronica.server.models.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("select u from User u where upper(u.email) = upper(?1)")
    Optional<User> findByEmailIgnoreCase(String email);

    @Query("select (count(u) > 0) from User u where upper(u.email) = upper(?1) ")
    boolean existsByEmail(String email);

    @Query("select (count(u) > 0) from User u where upper(u.username) = upper(?1)")
    boolean existsByUsername(String username);

    @Query("select u from User u left join u.roles roles where (?1 is null or u.status = ?1) and (?2 is null or roles in ?2)")
    List<User> findByStatusAndRolesIn(@Nullable Status status, @Nullable Collection<Roles> roles);



}
