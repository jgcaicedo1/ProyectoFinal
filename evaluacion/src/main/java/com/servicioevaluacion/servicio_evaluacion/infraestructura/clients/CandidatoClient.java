package com.servicioevaluacion.servicio_evaluacion.infraestructura.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.servicioevaluacion.servicio_evaluacion.aplicacion.dto.CandidatoDTO;

@FeignClient(name = "servicio-candidatos", url = "http://localhost:8083")
public interface CandidatoClient {
    
    @GetMapping("/candidatos/{id}")
    CandidatoDTO obtenerCandidato(@PathVariable("id") Long id);
}
