package com.example.homespend.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
public class Apartments implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    private String userCode;
    private String address_city;
    private String address_street;
    private String address_block;
    private String surface;
    private String apartmentsCode;
    private String administrator;
    private String administratorCode;

    public Apartments(Long id, String userCode, String address_city, String address_street, String address_block, String surface, String apartmentsCode, String administrator, String administratorCode) {
        this.id = id;
        this.userCode = userCode;
        this.address_city = address_city;
        this.address_street = address_street;
        this.address_block = address_block;
        this.surface = surface;
        this.apartmentsCode = apartmentsCode;
        this.administrator = administrator;
        this.administratorCode = administratorCode;
    }

    public Apartments() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getaddress_city() {
        return address_city;
    }

    public void setaddress_city(String address_city) {
        this.address_city = address_city;
    }

    public String getaddress_street() {
        return address_street;
    }

    public void setaddress_street(String address_street) {
        this.address_street = address_street;
    }

    public String getaddress_block() {
        return address_block;
    }

    public void setaddress_block(String address_block) {
        this.address_block = address_block;
    }

    public String getSurface() {
        return surface;
    }

    public void setSurface(String surface) {
        this.surface = surface;
    }

    public String getApartmentsCode() {
        return apartmentsCode;
    }

    public void setApartmentsCode(String apartmentsCode) {
        this.apartmentsCode = apartmentsCode;
    }

    public String getAdministrator() {
        return administrator;
    }

    public void setAdministrator(String administrator) {
        this.administrator = administrator;
    }

    public String getAdministratorCode() {
        return administratorCode;
    }

    public void setAdministratorCode(String administratorCode) {
        this.administratorCode = administratorCode;
    }

    @Override
    public String toString() {
        return "Apartments{" +
                "id=" + id +
                ", userCode='" + userCode + '\'' +
                ", address_city='" + address_city + '\'' +
                ", address_street='" + address_street + '\'' +
                ", address_block='" + address_block + '\'' +
                ", surface='" + surface + '\'' +
                ", apartmentsCode='" + apartmentsCode + '\'' +
                ", administrator='" + administrator + '\'' +
                ", administratorCode='" + administratorCode + '\'' +
                '}';
    }
}
