import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import clients from '../api/graphqlClient';
import { OBTENER_PUBLICACIONES } from '../graphql/queries';

// Placeholder para la mutación (debes definirla en ../graphql/queries)
import { ACTUALIZAR_ESTADO_PUBLICACION } from '../graphql/queries'; // Añade esta query

interface Publicacion {
  id: string;
  requisicionId: string;
  plataforma: string;
  fechaPublicacion: string;
  estado: string;
}

const PublicacionList = () => {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('user') || 'desconocido';
  const currentRole = localStorage.getItem('role') || 'desconocido';

  const { data, loading, error, refetch } = useQuery<{ obtenerPublicaciones: Publicacion[] }>(OBTENER_PUBLICACIONES, {
    client: clients.publicacion,
  });

  // Mutación para actualizar el estado (debes implementarla)
  const [actualizarEstadoPublicacion] = useMutation(ACTUALIZAR_ESTADO_PUBLICACION, {
    client: clients.publicacion,
    refetchQueries: [{ query: OBTENER_PUBLICACIONES }],
    onError: (error) => {
      alert('Error al actualizar el estado: ' + error.message);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Refrescar datos cada 5000 ms
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval); // Limpieza al desmontar
  }, [refetch]);

  // Función para manejar el cambio de estado
  const handleToggleEstado = async (id: string, currentEstado: string) => {
    const nuevoEstado = currentEstado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';
    try {
      await actualizarEstadoPublicacion({
        variables: {
          id,
          estado: nuevoEstado,
        },
      });
      alert(`Publicación ${nuevoEstado === 'ACTIVA' ? 'activada' : 'desactivada'} con éxito`);
    } catch (err) {
      console.error('Error al actualizar el estado:', err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#555' }}>Cargando publicaciones...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: '#d32f2f' }}>Error al cargar las publicaciones: {error.message}</div>;

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
            to="/publicaciones"
            style={{ color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500', padding: '8px 15px', borderRadius: '4px', transition: 'background 0.3s' }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#0056b3')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Lista de Publicaciones
          </Link>
          <Link
            to="/candidatos"
            style={{ color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500', padding: '8px 15px', borderRadius: '4px', transition: 'background 0.3s' }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#0056b3')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Lista de Candidatos
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
      <div style={{ padding: '20px', margin: '20px auto', maxWidth: '1200px' }}>
        <div style={{ 
          background: '#ffffff', 
          padding: '30px', 
          borderRadius: '12px', 
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)', 
          border: '1px solid #e0e0e0' 
        }}>
          <h2 style={{ textAlign: 'center', color: '#333', fontSize: '28px', marginBottom: '25px', fontWeight: '600' }}>
            Listado de Publicaciones
          </h2>
          {data && data.obtenerPublicaciones.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ 
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
                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>ID</th>
                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Ver Detalles</th>
                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Plataforma</th>
                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Fecha de Publicación</th>
                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left', borderBottom: '2px solid #1e3a8a' }}>Estado</th>
                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'center', borderBottom: '2px solid #1e3a8a' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.obtenerPublicaciones.map((pub: Publicacion) => (
                    <tr key={pub.id} style={{ 
                      borderBottom: '1px solid #eee', 
                      transition: 'background 0.3s ease' 
                    }} onMouseOver={(e) => (e.currentTarget.style.background = '#f0f4f8')} onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pub.id}</td>
                      <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '120px' }}>
                        <button
                          onClick={() => navigate(`/requisicion/detalle/${pub.requisicionId}`)}
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
                      <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pub.plataforma}</td>
                      <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pub.fechaPublicacion.split('T')[0]}</td>
                      <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pub.estado}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleToggleEstado(pub.id, pub.estado)}
                          style={{
                            padding: '8px 15px',
                            background: pub.estado === 'ACTIVA' ? '#dc3545' : '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'background 0.3s',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.background = pub.estado === 'ACTIVA' ? '#c82333' : '#218838')}
                          onMouseOut={(e) => (e.currentTarget.style.background = pub.estado === 'ACTIVA' ? '#dc3545' : '#28a745')}
                        >
                          {pub.estado === 'ACTIVA' ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#555', marginTop: '20px', fontSize: '16px' }}>
              No hay publicaciones disponibles
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicacionList;