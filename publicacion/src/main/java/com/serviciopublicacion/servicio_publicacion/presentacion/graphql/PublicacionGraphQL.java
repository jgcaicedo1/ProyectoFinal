package com.serviciopublicacion.servicio_publicacion.presentacion.graphql;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.serviciopublicacion.servicio_publicacion.aplicacion.dto.PublicacionDTO;
import com.serviciopublicacion.servicio_publicacion.dominio.model.Publicacion;
import com.serviciopublicacion.servicio_publicacion.aplicacion.service.PublicacionService;

import java.util.List;

@Controller
public class PublicacionGraphQL {

    private final PublicacionService publicacionService;

    public PublicacionGraphQL(PublicacionService publicacionService) {
        this.publicacionService = publicacionService;
    }

    @QueryMapping
    public List<PublicacionDTO> obtenerPublicaciones() {
        return publicacionService.obtenerPublicaciones();
    }

    @MutationMapping
    public PublicacionDTO crearPublicacion(@Argument Long requisicionId, @Argument String plataforma, @Argument String fechaPublicacion) {
        PublicacionDTO dto = new PublicacionDTO(null, requisicionId, plataforma, fechaPublicacion, "PENDIENTE");
        return publicacionService.crearPublicacion(dto);
    }

    @MutationMapping
    public Publicacion actualizarPublicacion(@Argument Long id, @Argument String estado) {
        return publicacionService.actualizarPublicacion(id, estado);
    }
}