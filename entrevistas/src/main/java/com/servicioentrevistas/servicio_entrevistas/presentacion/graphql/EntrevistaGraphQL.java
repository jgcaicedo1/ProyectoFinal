package com.servicioentrevistas.servicio_entrevistas.presentacion.graphql;

import com.servicioentrevistas.servicio_entrevistas.aplicacion.dto.EntrevistaDTO;
import com.servicioentrevistas.servicio_entrevistas.aplicacion.service.EntrevistaService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class EntrevistaGraphQL {

    private final EntrevistaService entrevistaService;

    public EntrevistaGraphQL(EntrevistaService entrevistaService) {
        this.entrevistaService = entrevistaService;
    }

    @QueryMapping
    public List<EntrevistaDTO> obtenerEntrevistas() {
        return entrevistaService.obtenerEntrevistas();
    }

    @MutationMapping
    public EntrevistaDTO programarEntrevista(@Argument Long candidatoId, @Argument String entrevistador,
                                             @Argument String fechaHora, @Argument String observaciones) {
        EntrevistaDTO dto = new EntrevistaDTO(null, candidatoId, entrevistador,
                LocalDateTime.parse(fechaHora), "PENDIENTE", observaciones);
        return entrevistaService.programarEntrevista(dto);
    }
}
