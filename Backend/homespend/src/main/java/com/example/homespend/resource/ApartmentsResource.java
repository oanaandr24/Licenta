package com.example.homespend.resource;

import com.example.homespend.model.Apartments;
import com.example.homespend.model.User;
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

    @GetMapping("/admin/{administratorCode}")
    public ResponseEntity<List<Apartments>> getAllApartmentsByAdministratorCode(@PathVariable String administratorCode) {
        List<Apartments> apartments = apartmentsService.getAllApartmentsByAdministratorCode(administratorCode);
        return ResponseEntity.ok(apartments);
    }

    @PostMapping("/add/{email}")
    public ResponseEntity<Apartments> create(@PathVariable String email, @RequestBody Apartments apartment) {
        return ResponseEntity.ok(apartmentsService.createApartmentForUser(email, apartment));
    }

    @Transactional
    @DeleteMapping("/delete/{apartmentCode}")
    public ResponseEntity<?> deleteApartment(@PathVariable("apartmentCode") String apartmentCode) {
        apartmentsService.deleteApartmentByApartmentCode(apartmentCode);
        billsService.deleteBillsByApartmentCode(apartmentCode);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/patch/id/{id}")
    public ResponseEntity<Apartments> updateApartmentById(@PathVariable Long id, @RequestBody Apartments apartment) {
        Apartments updatedApartment = apartmentsService.updateApartmentById(id,apartment);
        return new ResponseEntity<>(updatedApartment, HttpStatus.OK);
    }



}
