package com.example.homespend.repo;

import com.example.homespend.model.Index;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IndexRepo extends JpaRepository<Index,Long> {

    void deleteByApartmentsCode(String apartmentsCode);
    void deleteById(Long id);
    List<Index> findAllByApartmentsCode(String apartmentsCode);

}
