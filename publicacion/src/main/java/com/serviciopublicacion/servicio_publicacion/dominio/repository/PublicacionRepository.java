package com.serviciopublicacion.servicio_publicacion.dominio.repository;

import com.serviciopublicacion.servicio_publicacion.dominio.model.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {
    List<Publicacion> findByEstado(String estado);
}
