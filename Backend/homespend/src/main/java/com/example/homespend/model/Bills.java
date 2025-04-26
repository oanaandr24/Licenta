package com.example.homespend.model;

import jakarta.persistence.*;

import java.io.Serializable;
@Entity
public class Bills implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    private String type;
    private String number;
    private Float oldIndex;
    private Float newIndex;
    private Float amountConsumed;
    private String invoiceDate;
    private String dueDate;
    private String paymentValue;
    private String apartmentCode;

    public Bills() {
    }

    public Bills(Long id, String apartmentCode, String paymentValue, String dueDate, String invoiceDate, Float oldIndex, String number, String type, Float amountConsumed, Float newIndex) {
        this.id = id;
        this.apartmentCode = apartmentCode;
        this.paymentValue = paymentValue;
        if(amountConsumed!= 0)
        {
            this.amountConsumed = amountConsumed;
        }
        else
        {
            this.amountConsumed = newIndex - oldIndex;
        }
        this.dueDate = dueDate;
        this.invoiceDate = invoiceDate;
        this.oldIndex = oldIndex;
        this.number = number;
        this.type = type;
        this.newIndex = newIndex;
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

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Float getOldIndex() {
        return oldIndex;
    }

    public void setOldIndex(Float oldIndex) {
        this.oldIndex = oldIndex;
    }

    public Float getNewIndex() {
        return newIndex;
    }

    public void setNewIndex(Float newIndex) {
        this.newIndex = newIndex;
    }

    public Float getAmountConsumed() {
        return amountConsumed;
    }

    public void setAmountConsumed(Float amountConsumed) {
        this.amountConsumed = amountConsumed;
    }

    public String getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(String invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getPaymentValue() {
        return paymentValue;
    }

    public void setPaymentValue(String paymentValue) {
        this.paymentValue = paymentValue;
    }

    public String getApartmentCode() {
        return apartmentCode;
    }

    public void setApartmentCode(String apartmentCode) {
        this.apartmentCode = apartmentCode;
    }

    @Override
    public String toString() {
        return "Bills{" +
                "id=" + id +
                ", type='" + type + '\'' +
                ", number='" + number + '\'' +
                ", oldIndex=" + oldIndex +
                ", newIndex=" + newIndex +
                ", amountConsumed=" + amountConsumed +
                ", invoiceDate='" + invoiceDate + '\'' +
                ", dueDate='" + dueDate + '\'' +
                ", paymentValue='" + paymentValue + '\'' +
                ", apartmentCode='" + apartmentCode + '\'' +
                '}';
    }
}
