package com.example.homespend.service;

import com.example.homespend.model.Apartments;
import com.example.homespend.model.Bills;
import com.example.homespend.repo.ApartmentsRepo;
import com.example.homespend.repo.BillsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillsService {

    private final BillsRepo billsRepo;
    private final ApartmentsRepo apartmentsRepo;
    private final ApartmentsService apartmentsService;

    @Autowired
    public BillsService(BillsRepo billsRepo, ApartmentsRepo apartmentsRepo, ApartmentsService apartmentsService) {

        this.billsRepo = billsRepo;
        this.apartmentsRepo = apartmentsRepo;
        this.apartmentsService = apartmentsService;
    }

    public Bills addBills(Bills bill) {
        String apartmentsCode = bill.getApartmentsCode();
        if(apartmentsCode == null) {
            throw new RuntimeException("Apartment code not found");
        }
        Apartments apartment = apartmentsRepo.findByApartmentsCode(apartmentsCode).orElseThrow(() -> new RuntimeException("Apartment code not found"));

        if(bill.getAmountConsumed() == null){
            bill.setAmountConsumed(bill.getNewIndex()-bill.getOldIndex());
        }

        return billsRepo.save(bill);
    }

    public List<Bills> findAllBills() {

        return billsRepo.findAll();
    }

    public Bills updateBills(Bills bills) {
        return billsRepo.save(bills);
    }

    public void deleteBillsByApartmentCode(String apartmentsCode) {
        billsRepo.deleteByApartmentsCode(apartmentsCode);
    }

    public void deleteBill(Long id) {
        billsRepo.deleteById(id);
    }
}
