package com.example.homespend.service;

import com.example.homespend.model.Bills;
import com.example.homespend.model.User;
import com.example.homespend.repo.BillsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillsService {

    private final BillsRepo billsRepo;

    @Autowired
    public BillsService(BillsRepo billsRepo) {

        this.billsRepo = billsRepo;
    }

    public Bills addBills(Bills bills) {

        return billsRepo.save(bills);
    }

    public List<Bills> findAllBills() {

        return billsRepo.findAll();
    }

    public Bills updateBills(Bills bills) {
        return billsRepo.save(bills);
    }

    public void deleteBillsByApartmentCode(String apartmentCode) {
        billsRepo.deleteByApartmentCode(apartmentCode);
    }
}
