package com.example.homespend.repo;

import com.example.homespend.model.Apartments;
import com.example.homespend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApartmentsRepo extends JpaRepository<Apartments, String> {

    List<Apartments> findByUserCode(String userCode);
    void deleteByUserCode(String userCode);
    void deleteByApartamentsCode(String apartamentsCode);

}
