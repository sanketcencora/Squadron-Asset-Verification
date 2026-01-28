package org.squadron.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User extends PanacheEntity {
    public String username;
    public String password; // hashed
    public String role;
    public String name;

    // Additional profile fields
    public String email;
    public String phone;
    public String department;
    public String employeeId;
}