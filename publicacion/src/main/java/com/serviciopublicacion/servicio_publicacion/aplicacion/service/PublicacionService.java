package com.serviciopublicacion.servicio_publicacion.aplicacion.service;

import com.serviciopublicacion.servicio_publicacion.aplicacion.dto.PublicacionDTO;
import com.serviciopublicacion.servicio_publicacion.dominio.model.Publicacion;
import com.serviciopublicacion.servicio_publicacion.dominio.repository.PublicacionRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublicacionService {

    private final PublicacionRepository publicacionRepository;

    public PublicacionService(PublicacionRepository publicacionRepository) {
        this.publicacionRepository = publicacionRepository;
    }

    public List<PublicacionDTO> obtenerPublicaciones() {
        return publicacionRepository.findAll().stream()
                .map(pub -> new PublicacionDTO(
                        pub.getId(), pub.getRequisicionId(), pub.getPlataforma(),
                        pub.getFechaPublicacion(), pub.getEstado()))
                .collect(Collectors.toList());
    }

    public PublicacionDTO crearPublicacion(PublicacionDTO dto) {
        Publicacion publicacion = new Publicacion(null, dto.getRequisicionId(),
                dto.getPlataforma(), dto.getFechaPublicacion(), "PENDIENTE");
        Publicacion nuevaPublicacion = publicacionRepository.save(publicacion);
        return new PublicacionDTO(nuevaPublicacion.getId(), nuevaPublicacion.getRequisicionId(),
                nuevaPublicacion.getPlataforma(), nuevaPublicacion.getFechaPublicacion(),
                nuevaPublicacion.getEstado());
    }

    public Publicacion actualizarPublicacion(Long id, String estado) {
        // Verificar que el ID no sea nulo
        if (id == null) {
            throw new IllegalArgumentException("El ID de la publicación no puede ser nulo");
        }

        // Buscar la publicación existente
        Publicacion publicacionExistente = publicacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada con ID: " + id));

        // Actualizar los campos con los valores del DTO
        publicacionExistente.setEstado(estado);

        // Guardar los cambios
        Publicacion publicacionActualizada = publicacionRepository.save(publicacionExistente);

        // Retornar el DTO actualizado
        return publicacionActualizada;
    }
}