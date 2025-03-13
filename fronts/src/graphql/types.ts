// Dentro de src/graphql/types.ts
export interface Requisicion {
  id: string;              // ID! se convierte en string (TypeScript no usa ID como tipo nativo)
  cargo: string;           // String! se convierte en string
  funciones: string;       // String! se convierte en string
  categoriaSalarial: string; // String! se convierte en string
  perfil: string;          // String! se convierte en string
  estado: string;          // String! se convierte en string
  fechaInicio: string;     // String! se convierte en string
  fechaFin?: string | null; // String (sin !) es opcional, puede ser string o null
  idUsuarioSeleccionado?: string | null; // ID (sin !) es opcional, puede ser string o null
  idAreaSolicitante: string; // ID! se convierte en string
  comentarios: string;
}
  
  export interface RequisicionesData {
    requisiciones: Requisicion[];
  }
  