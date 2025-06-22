package com.example.homespend.service;

import com.example.homespend.model.Apartments;
import com.example.homespend.model.Bills;
import com.example.homespend.model.Index;
import com.example.homespend.repo.ApartmentsRepo;
import com.example.homespend.repo.BillsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

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

        if (bill.getAmountConsumed() == null && bill.getOldIndex() != null && bill.getNewIndex() != null)
        {
            bill.setAmountConsumed(bill.getNewIndex()-bill.getOldIndex());
        }
        if (bill.getStatus() == null)
        {
            bill.setStatus("NEPLĂTIT");
        }
        return billsRepo.save(bill);
    }

    public List<Bills> findAllBills() {

        return billsRepo.findAll();
    }

    public void deleteBillsByApartmentCode(String apartmentsCode) {
        billsRepo.deleteByApartmentsCode(apartmentsCode);
    }

    public void deleteBill(Long id) {
        billsRepo.deleteById(id);
    }

    public List<Bills> getBillsByApartmentsCode(String code) {
        return billsRepo.findBillsByApartmentsCode(code);
    }

    public Bills updateBillsById(Long id, Bills updatedFields, MultipartFile pdfFile) {
        Bills existingBill = billsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
        if (updatedFields != null) {
            if (updatedFields.getType() != null)
                existingBill.setType(updatedFields.getType());
            if (updatedFields.getNumber() != null)
                existingBill.setNumber(updatedFields.getNumber());
            if (updatedFields.getOldIndex() != null)
                existingBill.setOldIndex(updatedFields.getOldIndex());
            if (updatedFields.getNewIndex() != null)
                existingBill.setNewIndex(updatedFields.getNewIndex());
            if (updatedFields.getAmountConsumed() != null)
                existingBill.setAmountConsumed(updatedFields.getAmountConsumed());
            if (updatedFields.getInvoiceDate() != null)
                existingBill.setInvoiceDate(updatedFields.getInvoiceDate());
            if (updatedFields.getDueDate() != null)
                existingBill.setDueDate(updatedFields.getDueDate());
            if (updatedFields.getPaymentValue() != null)
                existingBill.setPaymentValue(updatedFields.getPaymentValue());
            if (updatedFields.getStatus() != null)
                existingBill.setStatus(updatedFields.getStatus());
            if (updatedFields.getProvider() != null)
                existingBill.setProvider(updatedFields.getProvider());
            if (updatedFields.getApartmentsCode() != null)
                throw new RuntimeException("Action not allowed!");
        }

        if (pdfFile != null && !pdfFile.isEmpty()) {
            try {
                existingBill.setPdfFile(pdfFile.getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Error reading PDF file", e);
            }
        }

        return billsRepo.save(existingBill);
    }

    public Bills removePdfFile(Long id) {
        Bills bill = billsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
        bill.setPdfFile(null);
        return billsRepo.save(bill);
    }

    public Bills getBillForIndex(Index index) {
        //Apartments apartment = apartmentsRepo.findByApartmentsCode(index.getApartmentsCode()).orElseThrow(() -> new RuntimeException("Apartment code not found"));

        List<Bills> billsList = billsRepo.findBillsByApartmentsCode(index.getApartmentsCode());

        Bills latestBill = billsList.stream()
                .filter(b -> index.getType().equalsIgnoreCase(b.getType())) // filtrare după tip
                .max(Comparator.comparing(Bills::getNewIndex))        // max după newIndex
                .orElse(null);
        if (latestBill == null) {
            return null;
        }

        Bills newBill = new Bills();

        newBill.setType(index.getType());
        newBill.setOldIndex(latestBill.getNewIndex());
        newBill.setNewIndex(index.getValue());
        newBill.setAmountConsumed(index.getValue() - latestBill.getNewIndex());
        newBill.setStatus("SCADENT");
        newBill.setProvider(latestBill.getProvider());
        newBill.setApartmentsCode(index.getApartmentsCode());

        return newBill;
    }

    public boolean checkIfIndexIsValid(Index index){
        if(index.getApartmentsCode() == null || index.getType() == null || index.getValue() == null) {
            return false;
        }
        if(apartmentsRepo.findByApartmentsCode(index.getApartmentsCode()).isEmpty()){
            return false;
        }
        return true;
    }
}
