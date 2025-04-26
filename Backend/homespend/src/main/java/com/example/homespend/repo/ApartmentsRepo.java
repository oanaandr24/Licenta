package com.example.homespend.repo;

import com.example.homespend.model.Apartments;
import com.example.homespend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApartmentsRepo extends JpaRepository<Apartments, Long> {

    List<Apartments> findByUserCode(String userCode);
    void deleteByUserCode(String userCode);
    void deleteByApartmentsCode(String apartmentsCode);
    Optional<Apartments> findByApartmentsCode(String apartmentsCode);
}
