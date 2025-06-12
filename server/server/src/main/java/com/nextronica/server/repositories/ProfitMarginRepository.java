package com.nextronica.server.repositories;

import com.nextronica.server.models.ProfitMargin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ProfitMarginRepository extends JpaRepository<ProfitMargin, Integer> {
    Optional<ProfitMargin> findTopByOrderByCreatedDateDesc();
}
