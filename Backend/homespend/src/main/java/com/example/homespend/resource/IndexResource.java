package com.example.homespend.resource;

import com.example.homespend.model.Bills;
import com.example.homespend.model.Index;
import com.example.homespend.service.IndexService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/index")
public class IndexResource {

    private final IndexService indexService;

    public IndexResource(IndexService indexService) {
        this.indexService = indexService;
    }

    @PostMapping("/add")
    public ResponseEntity<Index> addIndex(@RequestBody Index index) {
        return new ResponseEntity<>(indexService.addIndex(index), HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Index>> getAllIndex() {
        List<Index> indexes = indexService.findAllIndex();
        return new ResponseEntity<>(indexes, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<Index> updateIndex(@RequestBody Index index) {
        Index updateIndex = indexService.updateIndex(index);
        return new ResponseEntity<>(updateIndex, HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteIndex(@PathVariable("id") Long id) {
        indexService.deleteIndex(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/all/apartment/{code}")
    public List<Index> getIndexByApartmentCode(@PathVariable String code) {
        return indexService.getAllIndexByApartmentsCode(code);
    }
}
