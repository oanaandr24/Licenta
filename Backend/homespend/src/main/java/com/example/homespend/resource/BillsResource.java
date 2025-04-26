package com.example.homespend.resource;

import com.example.homespend.model.Bills;
import com.example.homespend.model.User;
import com.example.homespend.service.BillsService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bills")
public class BillsResource {

    private final BillsService billsService;

    public BillsResource(BillsService billsService) {

        this.billsService = billsService;
    }

    @PostMapping("/add")
    public ResponseEntity<Bills> addBills(@RequestBody Bills bills) {
        Bills newBills = billsService.addBills(bills);
        return new ResponseEntity<>(newBills, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Bills>> getAllBills() {
        List<Bills> bills = billsService.findAllBills();
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<Bills> updateBills(@RequestBody Bills bills) {
        Bills updateBills = billsService.updateBills(bills);
        return new ResponseEntity<>(updateBills, HttpStatus.OK);
    }


}
