package com.serviciorequisicion.servicio_requisicion.presentacion.graphql;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.serviciorequisicion.servicio_requisicion.aplicacion.dto.CandidatoDTO;
import com.serviciorequisicion.servicio_requisicion.aplicacion.service.CandidatoService;

@Controller
public class CandidatoGraphQL {
    private final CandidatoService candidatoService;

    public CandidatoGraphQL(CandidatoService candidatoService) {
        this.candidatoService = candidatoService;
    }

    @QueryMapping
    public CandidatoDTO candidato(@Argument Long id) {
        return candidatoService.obtenerCandidatoPorId(id);
    }
}
