import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import clients from "../api/graphqlClient";
import { OBTENER_REQUISICIONES, CREAR_PUBLICACION, ACTUALIZAR_ESTADO_REQUISICION, ACTUALIZAR_REQUISICION } from "../graphql/queries";
import "bootstrap/dist/css/bootstrap.min.css";

interface Requisicion {
  id: string;
  cargo: string;
  funciones: string;
  categoriaSalarial: string;
  perfil: string;
  estado: string;
  fechaInicio: string;
  fechaFin?: string | null;
  candidatoSeleccionado?: {
    id: string;
    nombre: string;
  } | null;
  idAreaSolicitante: string;
  comentarios?: string | null;
}

const RequisicionListRRHH: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('user') || 'desconocido';
  const currentRole = localStorage.getItem('role') || 'desconocido';

  const { data, loading, error, refetch } = useQuery<{ requisiciones: Requisicion[] }>(OBTENER_REQUISICIONES, {
    client: clients.requisicion,
    variables: { usuario: currentUser },
  });

  const [crearPublicacion] = useMutation(CREAR_PUBLICACION, {
    client: clients.publicacion,
    refetchQueries: [{ query: OBTENER_REQUISICIONES, variables: { usuario: currentUser } }],
  });

  const [actualizarEstadoRequisicion] = useMutation(ACTUALIZAR_ESTADO_REQUISICION, {
    client: clients.requisicion,
    refetchQueries: [{ query: OBTENER_REQUISICIONES, variables: { usuario: currentUser } }],
  });

  const [actualizarRequisicion] = useMutation(ACTUALIZAR_REQUISICION, {
    client: clients.requisicion,
    refetchQueries: [{ query: OBTENER_REQUISICIONES, variables: { usuario: currentUser } }],
  });

  const [fechaPublicacion, setFechaPublicacion] = useState("");
  const [selectedRequisicion, setSelectedRequisicion] = useState<Requisicion | null>(null);
  const [plataforma, setPlataforma] = useState("");
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionComment, setCorrectionComment] = useState("");

  const handleClickOpen = (requisicion: Requisicion) => {
    setSelectedRequisicion(requisicion);
    setPlataforma("");
    setFechaPublicacion("");
  };

  const handleClose = () => {
    setSelectedRequisicion(null);
    setPlataforma("");
    setFechaPublicacion("");
    refetch();
  };

  const handleGuardar = async () => {
    if (selectedRequisicion && plataforma && fechaPublicacion) {
      const fecha = new Date(fechaPublicacion);
      if (isNaN(fecha.getTime())) {
        alert("La fecha de publicación no es válida.");
        return;
      }

      try {
        await crearPublicacion({
          variables: {
            requisicionId: selectedRequisicion.id,
            plataforma: plataforma,
            fechaPublicacion: fechaPublicacion,
          },
        });

        await actualizarEstadoRequisicion({
          variables: {
            id: selectedRequisicion.id,
            estado: "APROBADO",
            fechaFin: fechaPublicacion
          },
        });

        alert("Publicación realizada correctamente y estado actualizado a APROBADO.");
        handleClose();
      } catch (err) {
        console.error("Error al procesar la publicación o al actualizar el estado:", err);
        alert("Error al publicar la vacante o actualizar el estado. Por favor, inténtelo de nuevo.");
      }
    } else {
      alert("Por favor, seleccione una plataforma y una fecha de publicación válidas.");
    }
  };

  const handleRechazar = async (requisicionId: string) => {
    if (window.confirm("¿Estás seguro de que deseas rechazar esta requisición?")) {
      try {
        await actualizarEstadoRequisicion({
          variables: {
            id: requisicionId,
            estado: "RECHAZADO",
            fechaFin: ""
          },
        });
        alert("Requisición rechazada correctamente.");
        refetch();
      } catch (err) {
        console.error("Error al rechazar la requisición:", err);
        alert("Error al rechazar la requisición.");
      }
    }
  };

  const handleCorregir = (requisicion: Requisicion) => {
    setSelectedRequisicion(requisicion);
    setCorrectionComment(requisicion.comentarios || "");
    setShowCorrectionModal(true);
  };

  const handleCloseCorrectionModal = () => {
    setShowCorrectionModal(false);
    setSelectedRequisicion(null);
    setCorrectionComment("");
    refetch();
  };

  const handleSaveCorrection = async () => {
    if (selectedRequisicion && correctionComment.trim()) {
      try {
        await actualizarRequisicion({
          variables: {
            id: selectedRequisicion.id,
            input: {
              cargo: selectedRequisicion.cargo,
              categoriaSalarial: selectedRequisicion.categoriaSalarial,
              perfil: selectedRequisicion.perfil,
              funciones: selectedRequisicion.funciones || "",
              comentarios: correctionComment.trim(),
            },
          },
        });

        await actualizarEstadoRequisicion({
          variables: {
            id: selectedRequisicion.id,
            estado: "CORREGIR",
            fechaFin: ""
          },
        });

        alert("Comentario guardado y estado actualizado a CORREGIR.");
        handleCloseCorrectionModal();
      } catch (err) {
        console.error("Error al guardar el comentario o actualizar el estado:", err);
        alert("Error al guardar el comentario. Por favor, inténtelo de nuevo.");
      }
    } else {
      alert("Por favor, ingrese un comentario válido.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  if (loading) return <p className="text-center mt-5">Cargando...</p>;
  if (error) return <p className="text-center mt-5 text-danger">Error: {error.message}</p>;

  const pendingRequisitions = data ? data.requisiciones.filter((req) => req.estado === "PENDIENTE") : [];

  const areaMap: { [key: string]: string } = {
    1:"Recursos Humanos",
    2:	"Tecnología",
    3:"Finanzas",
    4:	"Marketing",
    5:"Operaciones"
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", fontFamily: "Arial, sans-serif" }}>
      {/* Navbar */}
      <nav
        style={{
          background: "#007bff",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <Link
            to="/requisicion/rrhh"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "500",
              padding: "8px 15px",
              borderRadius: "4px",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#0056b3")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Lista de Solicitudes
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ color: "white", fontSize: "16px", fontWeight: "400" }}>
            Bienvenido {currentUser} al sistema, Tu rol es {currentRole}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 20px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#c82333")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#dc3545")}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <div style={{ padding: "20px", margin: "20px auto" }}>
        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
            border: "1px solid #e0e0e0",
          }}
        >
          <h2 style={{ textAlign: "center", color: "#333", fontSize: "28px", marginBottom: "25px", fontWeight: "600" }}>
            Listado de Requisiciones
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "#007bff", color: "white" }}>
                  <th style={{ padding: "15px", fontSize: "16px", fontWeight: "600", textAlign: "left" }}>Area Solicitante</th>
                  <th style={{ padding: "15px", fontSize: "16px", fontWeight: "600", textAlign: "left" }}>Cargo</th>
                  <th style={{ padding: "15px", fontSize: "16px", fontWeight: "600", textAlign: "left" }}>Categoría Salarial</th>
                  <th style={{ padding: "15px", fontSize: "16px", fontWeight: "600", textAlign: "left" }}>Perfil</th>
                  <th style={{ padding: "15px", fontSize: "16px", fontWeight: "600", textAlign: "left" }}>Funciones</th>
                  <th style={{ padding: "15px", fontSize: "16px", fontWeight: "600", textAlign: "left" }}>Estado</th>
                  <th style={{ padding: "15px", fontSize: "16px", fontWeight: "600", textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequisitions.map((req) => (
                  <tr
                    key={req.id}
                    style={{ borderBottom: "1px solid #e0e0e0", transition: "background 0.2s" }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#f5f7fa")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
                  >
                    <td style={{ padding: "15px", fontSize: "15px", color: "#333" }}>{areaMap[req.idAreaSolicitante] || req.idAreaSolicitante}</td>
                    <td style={{ padding: "15px", fontSize: "15px", color: "#333" }}>{req.cargo}</td>
                    <td style={{ padding: "15px", fontSize: "15px", color: "#333" }}>{req.categoriaSalarial}</td>
                    <td style={{ padding: "15px", fontSize: "15px", color: "#333" }}>{req.perfil}</td>
                    <td style={{ padding: "15px", fontSize: "15px", color: "#333", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{req.funciones}</td>
                    <td style={{ padding: "15px", fontSize: "15px", color: "#333" }}>{req.estado}</td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => handleClickOpen(req)}
                        disabled={loading}
                        style={{ fontSize: "14px", fontWeight: "500", transition: "background 0.3s" }}
                      >
                        Publicar
                      </button>
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => handleRechazar(req.id)}
                        disabled={loading}
                        style={{ fontSize: "14px", fontWeight: "500", transition: "background 0.3s" }}
                      >
                        Rechazar
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleCorregir(req)}
                        disabled={loading}
                        style={{ fontSize: "14px", fontWeight: "500", transition: "background 0.3s" }}
                      >
                        Corregir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pendingRequisitions.length === 0 && (
            <p style={{ textAlign: "center", color: "#555", marginTop: "20px", fontSize: "16px" }}>
              No hay requisiciones pendientes.
            </p>
          )}
        </div>
      </div>

      {/* Modal para Publicar */}
      {selectedRequisicion && !showCorrectionModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Publicar Requisición</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <label className="form-label">Opción de Publicación</label>
                  <div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="plataforma"
                        value="Interno"
                        checked={plataforma === "Interno"}
                        onChange={(e) => setPlataforma(e.target.value)}
                        disabled={loading}
                      />
                      <label className="form-check-label">Interno</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="plataforma"
                        value="Externo"
                        checked={plataforma === "Externo"}
                        onChange={(e) => setPlataforma(e.target.value)}
                        disabled={loading}
                      />
                      <label className="form-check-label">Externo</label>
                    </div>
                  </div>
                  {plataforma === "Externo" && (
                    <select
                      className="form-control mt-2"
                      value=""
                      disabled={loading}
                    >
                      <option value="">Seleccione la plataforma...</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Indeed">Indeed</option>
                    </select>
                  )}
                </div>
                <div className="mt-3">
                  <label htmlFor="fechaPublicacion" className="form-label">
                    Fecha de Expiración:
                  </label>
                  <input
                    type="date"
                    id="fechaPublicacion"
                    className="form-control"
                    value={fechaPublicacion}
                    onChange={(e) => setFechaPublicacion(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleGuardar}
                  disabled={loading}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Corregir */}
      {selectedRequisicion && showCorrectionModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Corregir Requisición</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseCorrectionModal}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <label className="form-label">Comentario para Corrección:</label>
                  <textarea
                    className="form-control"
                    value={correctionComment}
                    onChange={(e) => setCorrectionComment(e.target.value)}
                    placeholder="Ingrese los detalles para la corrección..."
                    rows={5}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseCorrectionModal}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-warning"
                  onClick={handleSaveCorrection}
                  disabled={loading}
                >
                  Guardar Comentario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequisicionListRRHH;