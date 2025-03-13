package com.apigateway.controller;

import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Controller
@CrossOrigin(origins = "http://localhost:5173")
public class GraphQLGatewayController {

    private final WebClient.Builder webClientBuilder;

    public GraphQLGatewayController(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    @QueryMapping
    public Mono<Object> servicioRequisicion(String query) {
        return webClientBuilder.build()
                .post()
                .uri("http://localhost:8000/graphql")
                .bodyValue(query)
                .retrieve()
                .bodyToMono(Object.class);
    }

    @QueryMapping
    public Mono<Object> servicioPublicacion(String query) {
        return webClientBuilder.build()
                .post()
                .uri("http://localhost:8001/graphql")
                .bodyValue(query)
                .retrieve()
                .bodyToMono(Object.class);
    }

    @QueryMapping
    public Mono<Object> servicioCandidatos(String query) {
        return webClientBuilder.build()
                .post()
                .uri("http://localhost:8002/graphql")
                .bodyValue(query)
                .retrieve()
                .bodyToMono(Object.class);
    }
}
