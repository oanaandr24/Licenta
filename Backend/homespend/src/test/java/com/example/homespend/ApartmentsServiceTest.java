package com.example.homespend;

import com.example.homespend.model.Apartments;
import com.example.homespend.model.User;
import com.example.homespend.repo.ApartmentsRepo;
import com.example.homespend.repo.BillsRepo;
import com.example.homespend.repo.IndexRepo;
import com.example.homespend.repo.UserRepo;
import com.example.homespend.service.ApartmentsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ApartmentsServiceTest {

    @Mock
    private ApartmentsRepo apartmentsRepo;
    @Mock
    private UserRepo userRepo;
    @Mock
    private BillsRepo billsRepo;
    @Mock
    private IndexRepo indexRepo;

    @InjectMocks
    private ApartmentsService apartmentsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAllApartments() {
        Apartments apt1 = new Apartments();
        Apartments apt2 = new Apartments();

        when(apartmentsRepo.findAll()).thenReturn(Arrays.asList(apt1, apt2));

        List<Apartments> result = apartmentsService.findAllApartments();
        assertEquals(2, result.size());
    }

    @Test
    void testCreateApartmentForUser() {
        String email = "test@example.com";
        User user = new User();
        user.setUserCode("USER123");

        Apartments apartment = new Apartments();

        when(userRepo.findUserByEmail(email)).thenReturn(user);
        when(apartmentsRepo.save(any(Apartments.class))).thenAnswer(i -> i.getArgument(0));

        Apartments result = apartmentsService.createApartmentForUser(email, apartment);

        assertNotNull(result.getApartmentsCode());
        assertEquals("USER123", result.getUserCode());
        assertEquals("CASA", result.getAdministratorCode());
    }
}