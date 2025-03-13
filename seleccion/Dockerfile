# Usa una imagen base con Java 17 (ajusta según tu versión de Java)
FROM openjdk:17-jdk-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo pom.xml y descarga las dependencias
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline

# Copia el resto del código fuente
COPY src ./src

# Construye el proyecto
RUN ./mvnw clean package -DskipTests

# Expone el puerto en el que tu aplicación se ejecuta (8000 según tu configuración)
EXPOSE 8000

# Define el comando para iniciar la aplicación
CMD ["java", "-jar", "target/servicio-seleccion-0.0.1-SNAPSHOT.jar"]