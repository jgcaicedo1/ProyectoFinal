package com.servicioseleccion.servicio_seleccion.dominio.repository;

import com.servicioseleccion.servicio_seleccion.dominio.model.Seleccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeleccionRepository extends JpaRepository<Seleccion, Long> {
    List<Seleccion> findByEvaluacionFinal(String evaluacionFinal);
}
