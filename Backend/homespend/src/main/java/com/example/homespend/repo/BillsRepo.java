package com.example.homespend.repo;

import com.example.homespend.model.Bills;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BillsRepo extends JpaRepository<Bills, Long> {

    void deleteByApartmentsCode(String apartmentsCode);
    void deleteById(Long billId);
    Optional<Bills> findBillsById(Long id);
    List<Bills> findBillsByApartmentsCode(String apartmentsCode);

}
