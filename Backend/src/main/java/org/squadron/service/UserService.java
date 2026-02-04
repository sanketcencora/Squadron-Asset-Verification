package org.squadron.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.squadron.model.User;
import org.squadron.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import jakarta.transaction.Transactional;

import java.util.Optional;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByRole(String role) {
        return userRepository.findByRole(role);
    }

    public Optional<User> findById(long id) {
        return Optional.ofNullable(userRepository.findById(id));
    }

    public java.util.List<User> findAll() {
        return userRepository.listAll();
    }

    public Optional<User> authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            if (u.password != null && BCrypt.checkpw(password, u.password)) {
                return Optional.of(u);
            }
        }
        return Optional.empty();
    }

    @Transactional
    public User register(String username, String rawPassword, String role, String name) {
        User u = new User();
        u.username = username;
        u.password = BCrypt.hashpw(rawPassword, BCrypt.gensalt());
        u.role = role;
        u.name = name;
        // optional extra fields left null by this signature
        userRepository.persist(u);
        return u;
    }

    @Transactional
    public User registerFull(String username, String rawPassword, String role, String name, String email, String phone, String department, String employeeId) {
        User u = new User();
        u.username = username;
        u.password = BCrypt.hashpw(rawPassword, BCrypt.gensalt());
        u.role = role;
        u.name = name;
        u.email = email;
        u.phone = phone;
        u.department = department;
        u.employeeId = employeeId;
        userRepository.persist(u);
        return u;
    }
}