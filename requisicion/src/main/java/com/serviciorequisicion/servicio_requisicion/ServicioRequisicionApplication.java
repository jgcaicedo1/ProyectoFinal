package com.serviciorequisicion.servicio_requisicion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ServicioRequisicionApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServicioRequisicionApplication.class, args);
	}

}
