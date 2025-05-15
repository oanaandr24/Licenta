package com.example.homespend.model;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
public class Index implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    private String type;
    private Float value;
    private String apartmentsCode;

    public Index() {}

    public Index(Long id, String type, Float value, String apartmentsCode) {
        this.id = id;
        this.type = type;
        this.value = value;
        this.apartmentsCode = apartmentsCode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getApartmentsCode() {
        return apartmentsCode;
    }

    public void setApartmentsCode(String apartmentsCode) {
        this.apartmentsCode = apartmentsCode;
    }

    public Float getValue() {
        return value;
    }

    public void setValue(Float value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "Index{" +
                "id=" + id +
                ", type='" + type + '\'' +
                ", value=" + value +
                ", apartmentsCode='" + apartmentsCode + '\'' +
                '}';
    }
}
