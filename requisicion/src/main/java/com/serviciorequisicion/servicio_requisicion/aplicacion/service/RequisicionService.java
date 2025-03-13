package com.serviciorequisicion.servicio_requisicion.aplicacion.service;

import com.serviciorequisicion.servicio_requisicion.aplicacion.dto.RequisicionDTO;
import com.serviciorequisicion.servicio_requisicion.aplicacion.dto.CandidatoDTO;
import com.serviciorequisicion.servicio_requisicion.dominio.model.Candidato;
import com.serviciorequisicion.servicio_requisicion.dominio.model.Requisicion;
import com.serviciorequisicion.servicio_requisicion.dominio.repository.CandidatoRepository;
import com.serviciorequisicion.servicio_requisicion.dominio.repository.RequisicionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequisicionService {

    private final RequisicionRepository requisicionRepository;
    private final CandidatoRepository candidatoRepository;
    private final JdbcTemplate jdbcTemplate; // Para consultar la tabla usuarios

    @Autowired
    public RequisicionService(RequisicionRepository requisicionRepository,CandidatoRepository candidatoRepository, JdbcTemplate jdbcTemplate) {
        this.requisicionRepository = requisicionRepository;
        this.candidatoRepository = candidatoRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<RequisicionDTO> obtenerTodasRequisiciones() {
        List<Requisicion> requisiciones;
        requisiciones = requisicionRepository.findAll();
        return requisiciones.stream()
                .map(this::convertirARequisicionDTO)
                .collect(Collectors.toList());
    }

    public List<RequisicionDTO> obtenerRequisiciones(String usuarioAutenticado) {
        Long idArea = obtenerIdAreaPorUsuario(usuarioAutenticado);
        List<Requisicion> requisiciones;

        if (idArea != null && "jefeInmediato".equals(obtenerRolPorUsuario(usuarioAutenticado))) {
            // Filtrar requisiciones por área para jefes inmediatos
            requisiciones = requisicionRepository.findByIdAreaSolicitante(idArea);
        } else {
            // Otros roles ven todas las requisiciones
            requisiciones = requisicionRepository.findAll();
        }

        return requisiciones.stream()
                .map(this::convertirARequisicionDTO)
                .collect(Collectors.toList());
    }

    public RequisicionDTO obtenerRequisicionPorId(Long id) {
        return requisicionRepository.findById(id)
            .map(this::convertirARequisicionDTO)
            .orElseThrow(() -> new RuntimeException("Requisición no encontrada con ID: " + id));
    }

    public RequisicionDTO crearRequisicion(RequisicionDTO dto) {
        if (dto.getFechaInicio() == null) {
            dto.setFechaInicio(LocalDate.now());
        }
        if (dto.getIdAreaSolicitante() == null) {
            throw new IllegalArgumentException("El ID del área solicitante es obligatorio");
        }

        Requisicion requisicion = new Requisicion(
            null,
            dto.getCargo(),
            dto.getFunciones(),
            dto.getCategoriaSalarial(),
            dto.getPerfil(),
            "PENDIENTE",
            dto.getFechaInicio(),
            dto.getFechaFin(),
            dto.getCandidatoSeleccionado() != null ? candidatoRepository.findById(dto.getCandidatoSeleccionado().getId()).orElse(null) : null,
            dto.getIdAreaSolicitante(),
            dto.getComentarios()
        );
        Requisicion nuevaRequisicion = requisicionRepository.save(requisicion);
        return convertirARequisicionDTO(nuevaRequisicion);
    }

    public RequisicionDTO actualizarEstado(Long id, String estado, String fechaFin) {
        return requisicionRepository.findById(id)
                .map(requisicion -> {
                    requisicion.setEstado(estado);
                    requisicion.setFechaFin(fechaFin != "" ? LocalDate.parse(fechaFin) : null);
                    Requisicion actualizada = requisicionRepository.save(requisicion);
                    return convertirARequisicionDTO(actualizada);
                })
                .orElseThrow(() -> new RuntimeException("Requisición no encontrada con ID: " + id));
    }

    public RequisicionDTO actualizarRequisicion(Long id, RequisicionDTO dto) {
        return requisicionRepository.findById(id)
            .map(requisicion -> {
                // Actualizar solo los campos permitidos
                requisicion.setCargo(dto.getCargo());
                requisicion.setCategoriaSalarial(dto.getCategoriaSalarial());
                requisicion.setPerfil(dto.getPerfil());
                requisicion.setFunciones(dto.getFunciones());
                requisicion.setEstado("PENDIENTE");
                requisicion.setFechaInicio(LocalDate.now());
                requisicion.setComentarios(dto.getComentarios() != null ? dto.getComentarios() : null );
    
                Requisicion actualizada = requisicionRepository.save(requisicion);
                return convertirARequisicionDTO(actualizada);
            })
            .orElseThrow(() -> new RuntimeException("Requisición no encontrada con ID: " + id));
    }

    public RequisicionDTO asignarUsuarioSeleccionado(Long id, Long idUsuarioSeleccionado) {
        return requisicionRepository.findById(id)
                .map(requisicion -> {
                    requisicion.getCandidatoSeleccionado().setId(idUsuarioSeleccionado);
                    if ("APROBADO".equals(requisicion.getEstado()) && requisicion.getFechaFin() == null) {
                        requisicion.setFechaFin(LocalDate.now());
                    }
                    Requisicion actualizada = requisicionRepository.save(requisicion);
                    return convertirARequisicionDTO(actualizada);
                })
                .orElseThrow(() -> new RuntimeException("Requisición no encontrada con ID: " + id));
    }

    private RequisicionDTO convertirARequisicionDTO(Requisicion requisicion) {
        CandidatoDTO candidatoDTO = null;
        if (requisicion.getCandidatoSeleccionado() != null) {
            candidatoDTO = new CandidatoDTO();
            candidatoDTO.setId(requisicion.getCandidatoSeleccionado().getId());
            candidatoDTO.setNombre(requisicion.getCandidatoSeleccionado().getNombre());
        }

        return new RequisicionDTO(
            requisicion.getId(),
            requisicion.getCargo(),
            requisicion.getFunciones(),
            requisicion.getCategoriaSalarial(),
            requisicion.getPerfil(),
            requisicion.getEstado(),
            requisicion.getFechaInicio(),
            requisicion.getFechaFin(),
            candidatoDTO,
            requisicion.getIdAreaSolicitante(),
            requisicion.getComentarios()
        );
    }

    // Consultar el área del usuario desde la base de datos
    public Long obtenerIdAreaPorUsuario(String usuario) {
        String sql = "SELECT id_area FROM usuarios WHERE usuario = ?";
        try {
            Integer idArea = jdbcTemplate.queryForObject(sql, Integer.class, usuario);
            return idArea != null ? idArea.longValue() : null;
        } catch (Exception e) {
            return null; // Si no se encuentra el usuario o no tiene área
        }
    }

    // Consultar el rol del usuario desde la base de datos
    private String obtenerRolPorUsuario(String usuario) {
        String sql = "SELECT rol FROM usuarios WHERE usuario = ?";
        try {
            return jdbcTemplate.queryForObject(sql, String.class, usuario);
        } catch (Exception e) {
            return null;
        }
    }
}