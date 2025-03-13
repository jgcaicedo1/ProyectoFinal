import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import clients from '../api/graphqlClient';
import { OBTENER_REQUISICIONES, ELIMINAR_REQUISICION } from '../graphql/queries';

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

const RequisicionList: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = localStorage.getItem('user') || 'desconocido';
    const currentRole = localStorage.getItem('role') || 'desconocido';
    const userAreaSolicitante = localStorage.getItem('area') || 'DEFAULT'; // Asumimos que está en localStorage

    const { data, loading, error, refetch } = useQuery<{ requisiciones: Requisicion[] }>(OBTENER_REQUISICIONES, {
        client: clients.requisicion,
        variables: { usuario: currentUser },
    });

    const [eliminarRequisicion] = useMutation(ELIMINAR_REQUISICION, {
        client: clients.requisicion,
        refetchQueries: [{ query: OBTENER_REQUISICIONES, variables: { usuario: currentUser } }],
    });

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        localStorage.removeItem('areaSolicitante'); // Limpiar también el área si existe
        navigate('/login');
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta requisición?')) {
            try {
                await eliminarRequisicion({ variables: { id } });
                alert('Requisición eliminada con éxito');
            } catch (err) {
                alert('Error al eliminar la requisición');
                console.error('Error:', err);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 5000);
        return () => clearInterval(interval);
    }, [refetch]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#555' }}>Cargando...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '50px', color: '#d32f2f' }}>Error: {error.message}. Por favor, intenta de nuevo.</div>;

    // Filtrar requisiciones por idAreaSolicitante del usuario logeado
    const filteredRequisitions = data ? data.requisiciones.filter((req) => req.idAreaSolicitante === userAreaSolicitante) : [];

    return (
        <div style={{ minHeight: '150vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', fontFamily: 'Arial, sans-serif' }}>
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
                    <Link to="/requisicion/nueva" style={{ color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500', padding: '8px 15px', borderRadius: '4px', transition: 'background 0.3s' }} onMouseOver={e => e.currentTarget.style.background = '#0056b3'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        Nueva Requisición
                    </Link>
                    <Link to="/requisicion/lista" style={{ color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500', padding: '8px 15px', borderRadius: '4px', transition: 'background 0.3s' }} onMouseOver={e => e.currentTarget.style.background = '#0056b3'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        Mis Requisiciones
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
                        onMouseOver={e => e.currentTarget.style.background = '#c82333'}
                        onMouseOut={e => e.currentTarget.style.background = '#dc3545'}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            {/* Contenido */}
            <div style={{ padding: '20px', margin: '20px auto' }}>
                <div style={{ 
                    background: '#ffffff', 
                    padding: '30px', 
                    borderRadius: '12px', 
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)', 
                    border: '1px solid #e0e0e0' 
                }}>
                    <h2 style={{ textAlign: 'center', color: '#333', fontSize: '28px', marginBottom: '25px', fontWeight: '600' }}>
                        Listado de Requisiciones
                    </h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse', 
                            background: '#fff', 
                            borderRadius: '8px', 
                            overflow: 'hidden' 
                        }}>
                            <thead>
                                <tr style={{ background: '#007bff', color: 'white' }}>
                                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left' }}>Cargo</th>
                                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left' }}>Categoría Salarial</th>
                                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left' }}>Perfil</th>
                                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left' }}>Funciones</th>
                                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left' }}>Fecha de Inicio</th>
                                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left' }}>Fecha de Fin</th>
                                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left' }}>Estado</th>
                                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left' }}>Candidato Aprobado</th>
                                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'left' }}>Comentarios</th>
                                    <th style={{ padding: '15px', fontSize: '16px', fontWeight: '600', textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequisitions.map((req) => (
                                    <tr key={req.id} style={{ borderBottom: '1px solid #e0e0e0', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f5f7fa'} onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                        <td style={{ padding: '15px', fontSize: '15px', color: '#333' }}>{req.cargo}</td>
                                        <td style={{ padding: '15px', fontSize: '15px', color: '#333' }}>{req.categoriaSalarial}</td>
                                        <td style={{ padding: '15px', fontSize: '15px', color: '#333' }}>{req.perfil}</td>
                                        <td style={{ padding: '15px', fontSize: '15px', color: '#333', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.funciones}</td>
                                        <td style={{ padding: '15px', fontSize: '15px', color: '#333' }}>{req.fechaInicio}</td>
                                        <td style={{ padding: '15px', fontSize: '15px', color: '#333' }}>{req.fechaFin || '-'}</td>
                                        <td style={{ padding: '15px', fontSize: '15px', color: '#333' }}>{req.estado}</td>
                                        <td style={{ padding: '15px', fontSize: '15px', color: '#333' }}>{req.candidatoSeleccionado?.nombre || 'Ninguno'}</td>
                                        <td style={{ padding: '15px', fontSize: '15px', color: '#333' }}>{req.comentarios || '-'}</td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            {req.estado === 'CORREGIR' && (
                                                <button
                                                    onClick={() => navigate(`/requisicion/editar/${req.id}`)}
                                                    style={{
                                                        padding: '8px 15px',
                                                        background: '#ffc107',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        fontWeight: '500',
                                                        transition: 'background 0.3s'
                                                    }}
                                                    onMouseOver={e => e.currentTarget.style.background = '#e0a800'}
                                                    onMouseOut={e => e.currentTarget.style.background = '#ffc107'}
                                                >
                                                    Editar
                                                </button>
                                            )}
                                            {req.estado === 'APROBADO' && (
                                                req.candidatoSeleccionado ? (
                                                    <button
                                                        onClick={() => navigate(`/candidato/${req.candidatoSeleccionado.id}`)}
                                                        style={{
                                                            padding: '8px 15px',
                                                            background: '#28a745',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '14px',
                                                            fontWeight: '500',
                                                            transition: 'background 0.3s'
                                                        }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#218838'}
                                                        onMouseOut={e => e.currentTarget.style.background = '#28a745'}
                                                    >
                                                        Ver Candidato
                                                    </button>
                                                ) : (
                                                    <span style={{ color: '#555', fontSize: '14px' }}>
                                                        En proceso de selección
                                                    </span>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredRequisitions.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#555', marginTop: '20px', fontSize: '16px' }}>
                            No hay requisiciones disponibles para tu área.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequisicionList;