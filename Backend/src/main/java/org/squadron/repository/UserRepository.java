package org.squadron.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.squadron.model.User;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {
    public Optional<User> findByUsername(String username) {
        return find("username", username).firstResultOptional();
    }

    public Optional<User> findByRole(String role) {
        return find("role", role).firstResultOptional();
    }
    
    public Optional<User> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }
    
    public User findByEmployeeId(String employeeId) {
        return find("employeeId", employeeId).firstResult();
    }
    
    public List<User> findByDepartment(String department) {
        return list("department", department);
    }
    
    public List<User> findByDepartments(List<String> departments) {
        return list("department in ?1", departments);
    }
    
    public List<String> findAllDepartments() {
        return getEntityManager()
            .createQuery("SELECT DISTINCT u.department FROM User u WHERE u.department IS NOT NULL", String.class)
            .getResultList();
    }
}
