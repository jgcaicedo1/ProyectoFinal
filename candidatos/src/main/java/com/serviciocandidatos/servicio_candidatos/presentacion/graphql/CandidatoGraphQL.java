package com.serviciocandidatos.servicio_candidatos.presentacion.graphql;

import com.serviciocandidatos.servicio_candidatos.aplicacion.dto.CandidatoDTO;
import com.serviciocandidatos.servicio_candidatos.dominio.model.Candidato;
import com.serviciocandidatos.servicio_candidatos.aplicacion.service.CandidatoService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class CandidatoGraphQL {

    private final CandidatoService candidatoService;

    public CandidatoGraphQL(CandidatoService candidatoService) {
        this.candidatoService = candidatoService;
    }

    @QueryMapping
    public List<CandidatoDTO> obtenerCandidatos() {
        return candidatoService.obtenerCandidatos();
    }

    @MutationMapping
    public CandidatoDTO registrarCandidato(@Argument Long vacanteId, @Argument String nombre,
                                           @Argument String email, @Argument String telefono,
                                           @Argument String curriculumUrl) {
        CandidatoDTO dto = new CandidatoDTO(null, vacanteId, nombre, email, telefono, curriculumUrl, "POSTULADO", null);
        return candidatoService.registrarCandidato(dto);
    }

    @MutationMapping
    public Candidato actualizarEstadoCandidato(@Argument Long id, @Argument String estado) {
        return candidatoService.actualizarCandidato(id, estado);
    }
}
