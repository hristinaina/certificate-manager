package com.example.certificateback.repository;

import com.example.certificateback.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IRoleRepository extends JpaRepository<Role, Long> {
	List<Role> findByName(String name);
	Optional<Role> findById(Long id);
}
