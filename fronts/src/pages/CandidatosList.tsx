import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_REQUISICIONES, OBTENER_PUBLICACIONES, REGISTRAR_CANDIDATO, ACTUALIZAR_CANDIDATO, OBTENER_TODAS_REQUISICIONES } from '../graphql/queries';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import clients from '../api/graphqlClient';
import { useNavigate, Link } from 'react-router-dom';

interface Requisicion {
  id: string;
  cargo: string;
  categoriaSalarial: string;
  perfil: string;
}

interface Publicacion {
  id: string;
  requisicionId: string;
  plataforma: string;
  fechaPublicacion: string | null;
}

interface Candidato {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  curriculumUrl: string;
  estado: string;
  fechaPostulacion: string;
  vacanteId: string;
}

interface Vacante {
  id: string;
  requisicionId: string;
  plataforma: string;
  fechaPublicacion: string | null;
  candidatos: Candidato[];
}

const CandidatosList: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState<'success' | 'danger'>('success');
  const [formData, setFormData] = useState({
    vacanteId: '',
    nombre: '',
    email: '',
    telefono: '',
    curriculumUrl: '',
    estado: 'POSTULADO',
    fechaPostulacion: new Date().toISOString().slice(0, 10),
  });

  const {
    data: dataRequisiciones,
    loading: loadingRequisiciones,
    error: errorRequisiciones,
  } = useQuery<{ requisiciones: Requisicion[] }>(OBTENER_TODAS_REQUISICIONES, {
    client: clients.requisicion,
  });

  const {
    data: dataPublicaciones,
    loading: loadingPublicaciones,
    error: errorPublicaciones,
    refetch: refetchPublicaciones,
  } = useQuery<{ obtenerPublicaciones: Vacante[] }>(OBTENER_PUBLICACIONES, {
    client: clients.publicacion,
  });

  const [registrarCandidato] = useMutation(REGISTRAR_CANDIDATO, {
    client: clients.candidatos,
    refetchQueries: [{ query: OBTENER_PUBLICACIONES }],
  });

  const [actualizarCandidato] = useMutation(ACTUALIZAR_CANDIDATO, {
    client: clients.candidatos,
    refetchQueries: [{ query: OBTENER_PUBLICACIONES }],
  });

  if (loadingRequisiciones || loadingPublicaciones) return <p style={{ textAlign: 'center', padding: '50px', color: '#555' }}>Cargando...</p>;
  if (errorRequisiciones || errorPublicaciones) {
    const mensajeError = errorRequisiciones?.message || errorPublicaciones?.message;
    return <p style={{ textAlign: 'center', padding: '50px', color: '#d32f2f' }}>Error: {mensajeError}</p>;
  }

  const handleEnviarPostulacion = async () => {
    try {
      const { data } = await registrarCandidato({
        variables: {
          vacanteId: formData.vacanteId,
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          curriculumUrl: formData.curriculumUrl,
        },
      });
      setAlertMessage('Postulación enviada con éxito!');
      setAlertVariant('success');
      setShowAlert(true);
      handleCloseModal();
      refetchPublicaciones();
      console.log('Respuesta de la mutación:', data);
    } catch (error) {
      setAlertMessage('Error al enviar postulación: ' + (error as any).message);
      setAlertVariant('danger');
      setShowAlert(true);
      console.error('Error enviando postulación:', error);
    }
  };

  const handleActualizarEstado = async (candidatoId: string, nuevoEstado: string) => {
    try {
      await actualizarCandidato({
        variables: {
          id: candidatoId,
          estado: nuevoEstado,
        },
      });
      setAlertMessage(`Candidato ${nuevoEstado === 'ACEPTADO' ? 'aceptado' : 'rechazado'} con éxito!`);
      setAlertVariant('success');
      setShowAlert(true);
      refetchPublicaciones();
    } catch (error) {
      setAlertMessage('Error al actualizar el estado: ' + (error as any).message);
      setAlertVariant('danger');
      setShowAlert(true);
      console.error('Error actualizando estado:', error);
    }
  };

  const handleVerCurriculum = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      setAlertMessage('No se proporcionó un enlace al currículum.');
      setAlertVariant('danger');
      setShowAlert(true);
    }
  };

  const listaRequisiciones = dataRequisiciones?.requisiciones ?? [];
  const listaPublicaciones = dataPublicaciones?.obtenerPublicaciones ?? [];
  
  // Filtrar publicaciones si el rol es candidatoExterno
  const currentRole = localStorage.getItem('role') || 'desconocido';
  const publicacionesFiltradas = currentRole === 'candidatoExterno'
    ? listaPublicaciones.filter((pub: Vacante) => pub.plataforma !== 'Interno')
    : listaPublicaciones;

  const handleOpenModal = (pubId: string) => {
    setShowModal(true);
    setFormData((prev) => ({ ...prev, vacanteId: pubId }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      vacanteId: '',
      nombre: '',
      email: '',
      telefono: '',
      curriculumUrl: '',
      estado: 'POSTULADO',
      fechaPostulacion: new Date().toISOString().slice(0, 10),
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const currentUser = localStorage.getItem('user') || 'desconocido';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', fontFamily: 'Arial, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ 
        background: '#007bff', 
        padding: '15px 30px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: 'white', fontSize: '16px', fontWeight: '400' }}>
            Bienvenido {currentUser} al sistema, Tu rol es {currentRole}
          </span>
          <button
            onClick={handleLogout}
            style={{ 
              padding: '8px 20px', 
              background: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              fontSize: '16px', 
              fontWeight: '600', 
              transition: 'background 0.3s' 
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#c82333')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#dc3545')}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <div style={{ padding: '20px', margin: '20px auto', maxWidth: '1200px' }}>
        {showAlert && (
          <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}

        <h2 style={{ textAlign: 'center', color: '#333', fontSize: '28px', marginBottom: '25px', fontWeight: '600' }}>
          Listado de Publicaciones y Candidatos
        </h2>
        {publicacionesFiltradas.length > 0 ? (
          publicacionesFiltradas.map((pub: Vacante) => {
            const requisicion = listaRequisiciones.find((req: Requisicion) => req.id === pub.requisicionId);
            return (
              <div key={pub.id} className="mb-4">
                <h4 style={{ color: '#1e3a8a', fontSize: '20px', fontWeight: '600', marginBottom: '15px' }}>
                  Publicación en {pub.plataforma}
                </h4>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'separate', 
                  borderSpacing: '0', 
                  background: '#fff', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  boxShadow: '0 6px 15px rgba(0,0,0,0.15)', 
                  marginBottom: '20px' 
                }}>
                  <thead style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)', color: '#fff', borderRadius: '12px 12px 0 0' }}>
                    <tr>
                      <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>
                        Detalles de la Requisición
                      </th>
                      <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>
                        Fecha de Publicación
                      </th>
                      <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'center', borderBottom: '2px solid #1e3a8a' }}>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ transition: 'background 0.3s ease, transform 0.2s ease' }} 
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#f0f4f8';
                          e.currentTarget.style.transform = 'scale(1.01)';
                        }} 
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}>
                      <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <button
                          onClick={() => navigate(`/postular/detalle/${pub.requisicionId}`)}
                          style={{
                            padding: '8px 15px',
                            background: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'background 0.3s',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.background = '#0056b3')}
                          onMouseOut={(e) => (e.currentTarget.style.background = '#007bff')}
                        >
                          Ver Detalles
                        </button>
                      </td>
                      <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pub.fechaPublicacion || 'No disponible'}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <Button variant="primary" onClick={() => handleOpenModal(pub.requisicionId)}>
                          Postularse
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: 'center', color: '#555', fontSize: '18px' }}>
            No hay publicaciones disponibles para tu rol.
          </p>
        )}

        {/* Modal para el formulario de postulación */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Formulario de Postulación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingrese su email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="telefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="curriculumUrl">
                <Form.Label>URL del Currículum</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese la URL de su currículum"
                  name="curriculumUrl"
                  value={formData.curriculumUrl}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="fechaPostulacion">
                <Form.Label>Fecha de Postulación</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaPostulacion"
                  value={formData.fechaPostulacion}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleEnviarPostulacion}>
              Enviar Postulación
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CandidatosList;