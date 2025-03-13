package com.servicioseleccion.servicio_seleccion.presentacion.graphql; 

import com.servicioseleccion.servicio_seleccion.aplicacion.dto.SeleccionDTO;
import com.servicioseleccion.servicio_seleccion.aplicacion.service.SeleccionService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class SeleccionGraphQL {

    private final SeleccionService seleccionService;

    public SeleccionGraphQL(SeleccionService seleccionService) {
        this.seleccionService = seleccionService;
    }

    @QueryMapping
    public List<SeleccionDTO> obtenerSeleccionados() {
        return seleccionService.obtenerSeleccionados();
    }

    @MutationMapping
    public SeleccionDTO registrarSeleccion(@Argument Long candidatoId, @Argument String evaluacionFinal,
                                           @Argument String comentario) {
        SeleccionDTO dto = new SeleccionDTO(null, candidatoId, evaluacionFinal, comentario, null);
        return seleccionService.registrarSeleccion(dto);
    }
}
