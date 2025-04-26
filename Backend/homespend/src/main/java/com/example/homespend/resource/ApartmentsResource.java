package com.example.homespend.resource;

import com.example.homespend.model.Apartments;
import com.example.homespend.repo.ApartmentsRepo;
import com.example.homespend.service.ApartmentsService;
import com.example.homespend.service.BillsService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apartments")
public class ApartmentsResource {
    private final ApartmentsService apartmentsService;
    private final ApartmentsRepo apartmentsRepo;
    private final BillsService billsService;

    public ApartmentsResource(ApartmentsService apartmentsService, ApartmentsRepo apartmentsRepo, BillsService billsService) {
        this.apartmentsService = apartmentsService;
        this.apartmentsRepo = apartmentsRepo;
        this.billsService = billsService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Apartments>> getAllApartments() {
        List<Apartments> apartments = apartmentsService.findAllApartments();
        return new ResponseEntity<>(apartments, HttpStatus.OK);
    }

    @GetMapping("/user/{userCode}")
    public ResponseEntity<List<Apartments>> getAllApartmentsByUserCode(@PathVariable String userCode) {
        List<Apartments> apartments = apartmentsService.getAllApartmentsByUserCode(userCode);
        return ResponseEntity.ok(apartments);
    }

    @PostMapping("/add")
    public ResponseEntity<Apartments> create(@RequestBody Apartments apartment) {
        return ResponseEntity.ok(apartmentsService.createApartmentForUser(apartment));
    }

    @Transactional
    @DeleteMapping("/delete/{apartmentCode}")
    public ResponseEntity<?> deleteApartment(@PathVariable("apartmentCode") String apartmentCode) {
        apartmentsService.deleteApartmentByApartmentCode(apartmentCode);
        billsService.deleteBillsByApartmentCode(apartmentCode);
        return new ResponseEntity<>(HttpStatus.OK);
    }



}
