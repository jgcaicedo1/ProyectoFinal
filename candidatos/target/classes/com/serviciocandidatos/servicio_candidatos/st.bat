@echo off
setlocal enabledelayedexpansion

:: Define los microservicios
set SERVICES=servicio-candidatos servicio-entrevistas servicio-evaluacion servicio-publicacion servicio-requisicion servicio-seleccion

:: Directorio base del proyecto
set BASE_DIR=PROJECTFINAL

:: Recorrer cada microservicio y crear la estructura de carpetas
for %%S in (%SERVICES%) do (
    echo Creando estructura en !BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S...
    
    :: Crear estructura de paquetes
    mkdir "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\aplicacion\service"
    mkdir "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\aplicacion\dto"
    mkdir "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\aplicacion\event"
    
    mkdir "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\dominio\model"
    mkdir "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\dominio\repository"
    
    mkdir "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\infraestructura\config"
    mkdir "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\infraestructura\persistence"
    mkdir "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\infraestructura\messaging"
    
    mkdir "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\presentacion\graphql"
    mkdir "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\presentacion\rest"
    
    mkdir "!BASE_DIR!\%%S\src\main\resources"

    :: Crear archivos vacíos para cada microservicio
    echo package ec.edu.espe.%%S.aplicacion.service; > "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\aplicacion\service\Service.java"
    echo package ec.edu.espe.%%S.aplicacion.dto; > "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\aplicacion\dto\DTO.java"
    echo package ec.edu.espe.%%S.aplicacion.event; > "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\aplicacion\event\Event.java"

    echo package ec.edu.espe.%%S.dominio.model; > "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\dominio\model\Model.java"
    echo package ec.edu.espe.%%S.dominio.repository; > "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\dominio\repository\Repository.java"

    echo package ec.edu.espe.%%S.infraestructura.config; > "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\infraestructura\config\Config.java"
    echo package ec.edu.espe.%%S.infraestructura.persistence; > "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\infraestructura\persistence\Persistence.java"
    echo package ec.edu.espe.%%S.infraestructura.messaging; > "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\infraestructura\messaging\KafkaConfig.java"

    echo package ec.edu.espe.%%S.presentacion.graphql; > "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\presentacion\graphql\GraphQLController.java"
    echo package ec.edu.espe.%%S.presentacion.rest; > "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\presentacion\rest\RestController.java"

    echo server: > "!BASE_DIR!\%%S\src\main\resources\application.yml"
    echo type Query { obtenerDatos: String } > "!BASE_DIR!\%%S\src\main\resources\schema.graphqls"

    echo package ec.edu.espe.%%S; > "!BASE_DIR!\%%S\src\main\java\ec\edu\espe\%%S\Servicio%%SApplication.java"

    echo Creado microservicio: %%S
)

echo.
echo Todas las carpetas y archivos han sido creados con éxito.
pause
