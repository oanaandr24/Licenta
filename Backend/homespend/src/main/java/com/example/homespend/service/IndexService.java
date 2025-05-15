package com.example.homespend.service;

import com.example.homespend.model.Apartments;
import com.example.homespend.model.Index;
import com.example.homespend.repo.ApartmentsRepo;
import com.example.homespend.repo.IndexRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IndexService {

    private final IndexRepo indexRepo;
    private final ApartmentsRepo apartmentsRepo;

    public IndexService(IndexRepo indexRepo, ApartmentsRepo apartmentsRepo) {
        this.indexRepo = indexRepo;
        this.apartmentsRepo = apartmentsRepo;
    }

    public Index addIndex(Index index) {
        String apartmentsCode = index.getApartmentsCode();
        if(apartmentsCode == null) {
            throw new RuntimeException("Apartment code not found");
        }
        Apartments apartment = apartmentsRepo.findByApartmentsCode(apartmentsCode).orElseThrow(() -> new RuntimeException("Apartment code not found"));
        return indexRepo.save(index);
    }

    public List<Index> findAllIndex() {
        return indexRepo.findAll();
    }

    public Index updateIndex(Index index) {
        return indexRepo.save(index);
    }

    public void deleteIndex(long id) {
        indexRepo.deleteById(id);
    }

    public void deleteIndexbyApartmentsCode(String apartmentsCode) {
        indexRepo.deleteByApartmentsCode(apartmentsCode);
    }

    public List<Index> getAllIndexByApartmentsCode(String apartmentsCode) {
        return indexRepo.findAllByApartmentsCode(apartmentsCode);
    }
}
