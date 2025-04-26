package com.example.homespend.repo;

import com.example.homespend.model.Bills;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillsRepo extends JpaRepository<Bills, Long> {

    void deleteByApartmentsCode(String apartmentsCode);
    void deleteById(Long billId);
}
