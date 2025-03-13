package com.servicioevaluacion.servicio_evaluacion.presentacion.graphql; 

import com.servicioevaluacion.servicio_evaluacion.aplicacion.dto.EvaluacionDTO;
import com.servicioevaluacion.servicio_evaluacion.aplicacion.service.EvaluacionService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class EvaluacionGraphQL {

    private final EvaluacionService evaluacionService;

    public EvaluacionGraphQL(EvaluacionService evaluacionService) {
        this.evaluacionService = evaluacionService;
    }

    @QueryMapping
    public List<EvaluacionDTO> obtenerEvaluaciones() {
        return evaluacionService.obtenerEvaluaciones();
    }

    @MutationMapping
    public EvaluacionDTO registrarEvaluacion(@Argument Long candidatoId, @Argument String tipoEvaluacion,
                                             @Argument double puntaje) {
        EvaluacionDTO dto = new EvaluacionDTO(null, candidatoId, tipoEvaluacion, puntaje, "PENDIENTE", null);
        return evaluacionService.registrarEvaluacion(dto);
    }
}
