import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_CANDIDATOS, ACTUALIZAR_ESTADO_CANDIDATO } from '../graphql/queries';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import clients from '../api/graphqlClient';
import { useNavigate, Link } from 'react-router-dom';

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

const Candidatos: React.FC = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState<'success' | 'danger'>('success');
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);

  const { data, loading, error, refetch } = useQuery<{ obtenerCandidatos: Candidato[] }>(OBTENER_CANDIDATOS, {
    client: clients.candidatos,
  });

  const [actualizarEstadoCandidato] = useMutation(ACTUALIZAR_ESTADO_CANDIDATO, {
    client: clients.candidatos,
    refetchQueries: [{ query: OBTENER_CANDIDATOS }],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000); // Refresca cada 5 segundos
    return () => clearInterval(interval);
  }, [refetch]);

  if (loading) return <p style={{ textAlign: 'center', padding: '50px', color: '#555' }}>Cargando...</p>;
  if (error) return <p style={{ textAlign: 'center', padding: '50px', color: '#d32f2f' }}>Error: {error.message}</p>;

  const handleActualizarEstado = async (id: string, nuevoEstado: string) => {
    try {
      await actualizarEstadoCandidato({
        variables: { id, estado: nuevoEstado },
      });
      setAlertMessage(`Estado actualizado a ${nuevoEstado} con éxito`);
      setAlertVariant('success');
      setShowAlert(true);
      refetch();
    } catch (error) {
      setAlertMessage('Error al actualizar el estado: ' + (error as any).message);
      setAlertVariant('danger');
      setShowAlert(true);
      console.error('Error actualizando el estado:', error);
    }
  };

  const handleVerCurriculum = (url: string) => {
    if (url) {
      window.open(url, '_blank'); // Abre el enlace en una nueva pestaña
    } else {
      setAlertMessage('No se proporcionó un enlace al currículum.');
      setAlertVariant('danger');
      setShowAlert(true);
    }
  };

  const handleCalificar = (candidatoId: string) => {
    // Redirigir a una página de calificación o manejar la lógica de calificación
    navigate(`/calificar/${candidatoId}`);
  };

  const candidatosPostulados = data?.obtenerCandidatos.filter((c) => c.estado === 'POSTULADO') || [];
  const candidatosAceptados = data?.obtenerCandidatos.filter((c) => c.estado === 'ACEPTADO') || [];

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const currentUser = localStorage.getItem('user') || 'desconocido';
  const currentRole = localStorage.getItem('role') || 'desconocido';

  // Roles permitidos para calificar
  const rolesPermitidos = ['psicologo', 'directorRRHH', 'jefeInmediato'];

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
          <Link
            to="/publicacion/lista"
            style={{ color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500', padding: '8px 15px', borderRadius: '4px', transition: 'background 0.3s' }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#0056b3')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Lista de Publicaciones
          </Link>
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
      <div style={{ padding: '20px', margin: '20px auto' }}>
        {showAlert && (
          <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}

        <h2 style={{ textAlign: 'center', color: '#333', fontSize: '28px', marginBottom: '25px', fontWeight: '600' }}>
          Candidatos Postulados
        </h2>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'separate', 
          borderSpacing: '0', 
          background: '#fff', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
          marginBottom: '30px' 
        }}>
          <thead style={{ background: '#1e3a8a', color: '#fff', borderRadius: '8px 8px 0 0' }}>
            <tr>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Nombre</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Email</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Teléfono</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>URL Currículum</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Fecha de Postulación</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Estado</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Requisición</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'center', borderBottom: '2px solid #1e3a8a' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {candidatosPostulados.map((candidato: Candidato) => (
              <tr key={candidato.id} style={{ transition: 'background 0.3s ease' }} 
                  onMouseOver={(e) => (e.currentTarget.style.background = '#f0f4f8')} 
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidato.nombre}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidato.email}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidato.telefono}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <a href={candidato.curriculumUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                    {candidato.curriculumUrl || 'No disponible'}
                  </a>
                </td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidato.fechaPostulacion}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidato.estado}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <button
                    onClick={() => navigate(`/postular/detalle/${candidato.vacanteId}`)}
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
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleActualizarEstado(candidato.id, 'ACEPTADO')}
                  >
                    Aceptar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleActualizarEstado(candidato.id, 'RECHAZADO')}
                  >
                    Rechazar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ textAlign: 'center', color: '#333', fontSize: '28px', marginBottom: '25px', fontWeight: '600' }}>
          Candidatos Aceptados
        </h2>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'separate', 
          borderSpacing: '0', 
          background: '#fff', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
        }}>
          <thead style={{ background: '#1e3a8a', color: '#fff', borderRadius: '8px 8px 0 0' }}>
            <tr>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Nombre</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Email</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Teléfono</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>URL Currículum</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Fecha de Postulación</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Requisición</th>
              <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Estado</th>
              {rolesPermitidos.includes(currentRole) && (
                <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'center', borderBottom: '2px solid #1e3a8a' }}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {candidatosAceptados.map((candidato: Candidato) => (
              <tr key={candidato.id} style={{ transition: 'background 0.3s ease' }} 
                  onMouseOver={(e) => (e.currentTarget.style.background = '#f0f4f8')} 
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidato.nombre}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidato.email}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidato.telefono}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <a href={candidato.curriculumUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                    {candidato.curriculumUrl || 'No disponible'}
                  </a>
                </td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidato.fechaPostulacion}</td>
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <button
                    onClick={() => navigate(`/postular/detalle/${candidato.vacanteId}`)}
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
                <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candidato.estado}</td>
                {rolesPermitidos.includes(currentRole) && (
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCalificar(candidato.id)}
                    >
                      Calificar
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Candidatos;