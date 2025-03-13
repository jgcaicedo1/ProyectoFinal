import { gql } from '@apollo/client';

export const OBTENER_REQUISICIONES = gql`
  query ObtenerRequisiciones($usuario: String!) {
    requisiciones(usuario: $usuario) {
            id
            cargo
            categoriaSalarial
            perfil
            funciones
            estado
            fechaInicio
            fechaFin
            candidatoSeleccionado {
                id
                nombre
            }
            idAreaSolicitante
            comentarios
        }
    }
`;

export const OBTENER_TODAS_REQUISICIONES = gql`
  query ObtenerTodasRequisiciones{
    obtenerTodasRequisiciones {
            id
            cargo
            categoriaSalarial
            perfil
            funciones
            estado
            fechaInicio
            fechaFin
            candidatoSeleccionado {
                id
                nombre
            }
            idAreaSolicitante
            comentarios
        }
    }
`;

export const ELIMINAR_REQUISICION = gql`
  mutation EliminarRequisicion($id: ID!) {
        eliminarRequisicion(id: $id) {
            id
        }
    }
`;

export const CREAR_REQUISICION = gql`
    mutation CrearRequisicion($input: RequisicionInput!) {
        crearRequisicion(input: $input) {
            id
            cargo
            categoriaSalarial
            perfil
            funciones
            estado
            fechaInicio
            fechaFin
            candidatoSeleccionado {
                id
                nombre
            }
            idAreaSolicitante
            comentarios
        }
    }
`;

export const OBTENER_ID_AREA_POR_USUARIO = gql`
    query ObtenerIdAreaPorUsuario($usuario: String!) {
        obtenerIdAreaPorUsuario(usuario: $usuario)
    }
`;


export const ACTUALIZAR_ESTADO_REQUISICION = gql`
mutation ActualizarEstadoRequisicion($id: ID!, $estado: String!, $fechaFin: String!) {
  actualizarEstadoRequisicion(id: $id, estado: $estado, fechaFin: $fechaFin) {
    id
    estado
    fechaFin
  }
}
`;




export const OBTENER_CANDIDATOS = gql`
  query ObtenerCandidatos {
    obtenerCandidatos {
      id
      vacanteId
      nombre
      email
      telefono
      curriculumUrl
      estado
      fechaPostulacion
    }
  }
`;


export const ACTUALIZAR_ESTADO_CANDIDATO = gql`
  mutation ActualizarEstadoCandidato($id: ID!, $estado: String!) {
    actualizarEstadoCandidato(id: $id, estado: $estado) {
      id
      estado
    }
  }
`;

export const REGISTRAR_CANDIDATO = gql`
  mutation RegistrarCandidato($vacanteId: ID!, $nombre: String!, $email: String!, $telefono: String!, $curriculumUrl: String!) {
    registrarCandidato(vacanteId: $vacanteId, nombre: $nombre, email: $email, telefono: $telefono, curriculumUrl: $curriculumUrl) {
      id
      vacanteId
      nombre
      email
      telefono
      curriculumUrl
      estado
      fechaPostulacion
    }
  }
`;

export const ACTUALIZAR_CANDIDATO = gql`
  mutation ActualizarCandidato($id: String!, $estado: String!) {
  actualizarCandidato(id: $id, estado: $estado) {
    id
    estado
  }
}
`;

export const OBTENER_PUBLICACIONES = gql`
query {
    obtenerPublicaciones {
        id
        requisicionId
        plataforma
        fechaPublicacion
        estado
    }
}
`;

export const ACTUALIZAR_ESTADO_PUBLICACION = gql`
mutation ActualizarPublicacion($id: ID!, $estado: String) {
  actualizarPublicacion(id: $id,estado: $estado) {
    id
    estado
  }
}
`;


export const CREAR_PUBLICACION = gql`
    mutation CrearPublicacion($requisicionId: ID!, $plataforma: String!, $fechaPublicacion: String!) {
        crearPublicacion(requisicionId: $requisicionId, plataforma: $plataforma, fechaPublicacion: $fechaPublicacion) {
            id
            requisicionId
            plataforma
            fechaPublicacion
            estado
        }
    }
`;

export const OBTENER_CANDIDATO = gql`
  query ObtenerCandidato($id: ID!) {
    candidato(id: $id) {
        id
        nombre
        email
        curriculum_url
        telefono
    }
}
`;

export const OBTENER_REQUISICION = gql`
  query ObtenerRequisicion($id: ID!) {
    obtenerRequisicionPorId(id: $id) {
      id
      cargo
      categoriaSalarial
      perfil
      funciones
  }
}
`;

export const ACTUALIZAR_REQUISICION = gql`
  mutation ActualizarRequisicion($id: ID!, $input: RequisicionInput!) {
    actualizarRequisicion(id: $id, input: $input) {
            id
            cargo
            categoriaSalarial
            perfil
            funciones
            estado
            fechaInicio
            fechaFin
            candidatoSeleccionado {
                id
                nombre
            }
            idAreaSolicitante
            comentarios
        }
}
`;