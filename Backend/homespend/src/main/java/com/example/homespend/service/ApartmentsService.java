package com.example.homespend.service;

import com.example.homespend.model.Apartments;
import com.example.homespend.model.User;
import com.example.homespend.repo.ApartmentsRepo;
import com.example.homespend.repo.BillsRepo;
import com.example.homespend.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApartmentsService {
    private final ApartmentsRepo apartmentsRepo;
    private final UserRepo userRepo;
    private final BillsRepo billsRepo;

    public ApartmentsService(ApartmentsRepo apartmentsRepo, UserRepo userRepo, BillsRepo billsRepo) {
        this.apartmentsRepo = apartmentsRepo;
        this.userRepo = userRepo;
        this.billsRepo = billsRepo;
    }

    public List<Apartments> findAllApartments() {

        return apartmentsRepo.findAll();
    }

    public Apartments createApartmentForUser(String userCode, Apartments apartment) {
        User user = userRepo.findUserByUserCode(userCode)
                .orElseThrow(() -> new RuntimeException("User not found"));

        apartment.setUserCode(user.getUserCode());
        return apartmentsRepo.save(apartment);
    }

   public List<Apartments> getAllApartmentsByUserCode(String userCode) {

       return apartmentsRepo.findByUserCode(userCode);
   }

   public void deleteApartmentsByUserCode(String userCode) {
        List<Apartments> apt = apartmentsRepo.findByUserCode(userCode);
        apartmentsRepo.deleteByUserCode(userCode);
        for (Apartments ap : apt) {
            billsRepo.deleteByApartmentCode(ap.getApartamentsCode());
        }
   }

   public void deleteApartmentByApartmentCode(String apartmentCode) {
        apartmentsRepo.deleteByApartamentsCode(apartmentCode);
   }

}
