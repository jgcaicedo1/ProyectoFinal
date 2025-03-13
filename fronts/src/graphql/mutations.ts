import { gql } from "@apollo/client";

export const CREAR_REQUISICION = gql`
  mutation CrearRequisicion($input: RequisicionInput!) {
    crearRequisicion(input: $input) {
      id
      cargo
      categoriaSalarial
      perfil
      estado
    }
  }
`;
