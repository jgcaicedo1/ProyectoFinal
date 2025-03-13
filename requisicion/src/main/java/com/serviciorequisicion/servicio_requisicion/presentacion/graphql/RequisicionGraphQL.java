package com.serviciorequisicion.servicio_requisicion.presentacion.graphql;

import com.serviciorequisicion.servicio_requisicion.aplicacion.dto.RequisicionDTO;
import com.serviciorequisicion.servicio_requisicion.aplicacion.service.RequisicionService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;
import java.util.List;

@Controller
public class RequisicionGraphQL {

    private final RequisicionService requisicionService;

    public RequisicionGraphQL(RequisicionService requisicionService) {
        this.requisicionService = requisicionService;
    }

    @QueryMapping
    public List<RequisicionDTO> requisiciones(@Argument String usuario) {
        return requisicionService.obtenerRequisiciones(usuario);
    }

    @QueryMapping
    public List<RequisicionDTO> obtenerTodasRequisiciones() {
        return requisicionService.obtenerTodasRequisiciones();
    }

    @QueryMapping
    public RequisicionDTO obtenerRequisicionPorId(@Argument Long id) {
        return requisicionService.obtenerRequisicionPorId(id);
    }

    @QueryMapping
public Long obtenerIdAreaPorUsuario(@Argument String usuario) {
    return requisicionService.obtenerIdAreaPorUsuario(usuario); // Asegúrate de que RequisicionService tenga este método
}

    @MutationMapping
    public RequisicionDTO crearRequisicion(@Argument("input") RequisicionDTO input) {
        // Asegurar que el DTO esté completo antes de pasarlo al servicio
        if (input.getEstado() == null) {
            input.setEstado("PENDIENTE"); // Estado por defecto
        }
        if (input.getFechaInicio() == null) {
            input.setFechaInicio(LocalDate.now()); // Fecha por defecto
        }
        return requisicionService.crearRequisicion(input);
    }

    @MutationMapping
    public RequisicionDTO actualizarEstadoRequisicion(@Argument Long id, @Argument String estado, @Argument String fechaFin) {
        return requisicionService.actualizarEstado(id, estado, fechaFin);
    }

    @MutationMapping
    public RequisicionDTO asignarUsuarioSeleccionado(@Argument Long id, @Argument Long idUsuarioSeleccionado) {
        return requisicionService.asignarUsuarioSeleccionado(id, idUsuarioSeleccionado);
    }

    @MutationMapping
    public RequisicionDTO actualizarRequisicion(@Argument Long id, @Argument("input") RequisicionDTO input) {
        return requisicionService.actualizarRequisicion(id, input);
    }
}