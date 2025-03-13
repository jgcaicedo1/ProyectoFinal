# Imagen base con JRE en lugar de JDK para reducir el tamaño
FROM eclipse-temurin:21-jre AS runtime

# Crear usuario no root por seguridad
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo JAR
COPY target/servicio-publicacion-0.0.1-SNAPSHOT.jar app.jar

# Cambiar permisos y ejecutar con el usuario no root
RUN chown appuser:appgroup /app/app.jar
USER appuser

# Exponer el puerto de la aplicación
EXPOSE 8001

# Comando de inicio
CMD ["java", "-jar", "/app/app.jar"]
