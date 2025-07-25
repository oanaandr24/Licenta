package com.example.homespend.service;

import com.example.homespend.model.Apartments;
import com.example.homespend.model.User;
import com.example.homespend.repo.ApartmentsRepo;
import com.example.homespend.repo.BillsRepo;
import com.example.homespend.repo.IndexRepo;
import com.example.homespend.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ApartmentsService {
    private final ApartmentsRepo apartmentsRepo;
    private final UserRepo userRepo;
    private final BillsRepo billsRepo;
    private final IndexRepo indexRepo;

    public ApartmentsService(ApartmentsRepo apartmentsRepo, UserRepo userRepo, BillsRepo billsRepo, IndexRepo indexRepo) {
        this.apartmentsRepo = apartmentsRepo;
        this.userRepo = userRepo;
        this.billsRepo = billsRepo;
        this.indexRepo = indexRepo;
    }

    public List<Apartments> findAllApartments() {

        return apartmentsRepo.findAll();
    }

    public Apartments createApartmentForUser(String email, Apartments apartment) {

        User user = userRepo.findUserByEmail(email);
        apartment.setUserCode(user.getUserCode());
        String userCode = apartment.getUserCode();
        if(apartment.getAdministratorCode() == null){
            apartment.setAdministratorCode("CASA");
        }
        if(userCode == null) {
             throw new RuntimeException("User not found");
        }
        apartment.setApartmentsCode(UUID.randomUUID().toString());
//        User user = userRepo.findUserByUserCode(userCode)
//                .orElseThrow(() -> new RuntimeException("User not found"));

        return apartmentsRepo.save(apartment);
    }

   public List<Apartments> getAllApartmentsByUserCode(String userCode) {
       return apartmentsRepo.findByUserCode(userCode);
   }

   public List<Apartments> getAllApartmentsByAdministratorCode(String administratorCode) {
        return apartmentsRepo.findByAdministratorCode(administratorCode);
   }

   public void deleteApartmentsByUserCode(String userCode) {
        List<Apartments> apt = apartmentsRepo.findByUserCode(userCode);
        apartmentsRepo.deleteByUserCode(userCode);
        for (Apartments ap : apt) {
            billsRepo.deleteByApartmentsCode(ap.getApartmentsCode());
            indexRepo.deleteByApartmentsCode(ap.getApartmentsCode());
        }
   }

   public void deleteApartmentByApartmentCode(String apartmentsCode) {
        apartmentsRepo.deleteByApartmentsCode(apartmentsCode);
   }

   public Optional<Apartments> findApartmentByApartmentCode(String apartmentsCode) {
        return apartmentsRepo.findByApartmentsCode(apartmentsCode);
   }

    public Apartments updateApartmentById(Long id, Apartments apartment) {
        Optional<Apartments> optionalExistingApartment = apartmentsRepo.findById(id);
        if (optionalExistingApartment.isEmpty()) {
            throw new RuntimeException("Apartment not found with id: " + id);
        }
        Apartments existingApartment = optionalExistingApartment.get();
        Apartments updatedApartment = updateFields(apartment, existingApartment);

        return apartmentsRepo.save(updatedApartment);
    }

    private Apartments updateFields(Apartments newApartment, Apartments existingApartment) {
        if (newApartment.getaddress_city() != null) existingApartment.setaddress_city(newApartment.getaddress_city());
        if (newApartment.getaddress_street() != null) existingApartment.setaddress_street(newApartment.getaddress_street());
        if (newApartment.getaddress_block() != null) existingApartment.setaddress_block(newApartment.getaddress_block());
        if (newApartment.getSurface() != null) existingApartment.setSurface(newApartment.getSurface());
        if (newApartment.getAdministrator() != null) existingApartment.setAdministrator(newApartment.getAdministrator());

        if (newApartment.getApartmentsCode() != null || newApartment.getUserCode() != null || newApartment.getAdministratorCode() != null) {
            throw new RuntimeException("Patch not allowed!");
        }
        return existingApartment;
    }

}
