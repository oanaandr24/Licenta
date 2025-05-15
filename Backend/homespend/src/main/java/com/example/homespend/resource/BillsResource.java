package com.example.homespend.resource;

import com.example.homespend.model.Bills;
import com.example.homespend.model.User;
import com.example.homespend.service.BillsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/bills")
public class BillsResource {

    private final BillsService billsService;

    public BillsResource(BillsService billsService) {

        this.billsService = billsService;
    }

    /*@PostMapping("/add")
    public ResponseEntity<Bills> addBills(@RequestBody Bills bills) {
        Bills newBills = billsService.addBills(bills);
        return new ResponseEntity<>(newBills, HttpStatus.CREATED);
    }*/

    @PostMapping("/add")
    public ResponseEntity<Bills> addBills(
            @RequestPart("bills") String billsJson,
            @RequestPart(value = "pdfFile", required = false) MultipartFile pdfFile
    ) throws IOException {
        // Convertește JSON-ul în obiect Bills
        ObjectMapper objectMapper = new ObjectMapper();
        Bills bills = objectMapper.readValue(billsJson, Bills.class);

        // Setează PDF-ul dacă a fost trimis
        if (pdfFile != null && !pdfFile.isEmpty()) {
            bills.setPdfFile(pdfFile.getBytes());
        }

        Bills savedBills = billsService.addBills(bills);
        return new ResponseEntity<>(savedBills, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Bills>> getAllBills() {
        List<Bills> bills = billsService.findAllBills();
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }

    /*@PatchMapping("/patch/id/{id}")
    public ResponseEntity<Bills> updateBills(@PathVariable Long id, @RequestBody Bills bills) {
        Bills updateBills = billsService.updateBillsById(id, bills);
        return new ResponseEntity<>(updateBills, HttpStatus.OK);
    }*/

    @PatchMapping(value = "/patch/id/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Bills> updateBills(
            @PathVariable Long id,
            @RequestPart(value = "bills", required = false) String billsJson,
            @RequestPart(value = "pdfFile", required = false) MultipartFile pdfFile)
            throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        Bills bills = objectMapper.readValue(billsJson, Bills.class);

        Bills updated = billsService.updateBillsById(id, bills, pdfFile);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBills(@PathVariable("id") Long id) {
        billsService.deleteBill(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/all/apartment/{code}")
    public List<Bills> getBillsByApartmentCode(@PathVariable String code) {
        return billsService.getBillsByApartmentsCode(code);
    }

    @PatchMapping("/remove-pdf/id/{id}")
    public ResponseEntity<Bills> removePdfFile(@PathVariable Long id) {
        Bills updatedBill = billsService.removePdfFile(id);
        return new ResponseEntity<>(updatedBill, HttpStatus.OK);
    }

}
