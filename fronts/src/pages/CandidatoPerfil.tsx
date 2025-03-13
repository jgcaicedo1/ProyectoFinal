// src/pages/CandidatoPerfil.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate, Link, useParams } from 'react-router-dom';
import clients from '../api/graphqlClient';
import { OBTENER_CANDIDATO } from '../graphql/queries';

interface Candidato {
    id: string;
    nombre: string;
    email: string;
    curriculum_url: string; // URL o texto
    telefono: string;
}

const CandidatoPerfil: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Obtiene el ID del candidato de la URL
    const navigate = useNavigate();
    const { data, loading, error } = useQuery<{ candidato: Candidato }>(OBTENER_CANDIDATO, {
        client: clients.requisicion,
        variables: { id },
    });

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const currentUser = localStorage.getItem('user') || 'desconocido';
    const currentRole = localStorage.getItem('role') || 'desconocido';

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#555' }}>Cargando...</div>;
    if (error || !data?.candidato) return <div style={{ textAlign: 'center', padding: '50px', color: '#d32f2f' }}>Error: {error?.message || 'Candidato no encontrado'}. Por favor, intenta de nuevo.</div>;

    const { nombre, email, curriculum_url, telefono } = data.candidato;

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
            <div style={{ padding: '40px', maxWidth: '700px', margin: '40px auto' }}>
                <div style={{ 
                    background: '#ffffff', 
                    padding: '30px', 
                    borderRadius: '12px', 
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)', 
                    border: '1px solid #e0e0e0' 
                }}>
                    <h2 style={{ textAlign: 'center', color: '#333', fontSize: '28px', marginBottom: '25px', fontWeight: '600' }}>
                        Perfil del Candidato
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ color: '#555', fontSize: '15px', fontWeight: '500' }}>Nombre:</label>
                            <p style={{ padding: '12px', background: '#fafafa', border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px', color: '#333' }}>{nombre}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ color: '#555', fontSize: '15px', fontWeight: '500' }}>Correo:</label>
                            <p style={{ padding: '12px', background: '#fafafa', border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px', color: '#333' }}>{email}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ color: '#555', fontSize: '15px', fontWeight: '500' }}>CV:</label>
                            {curriculum_url.startsWith('http') ? (
                                <a href={curriculum_url} target="_blank" rel="noopener noreferrer" style={{ padding: '12px', background: '#fafafa', border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px', color: '#007bff', textDecoration: 'none' }}>
                                    Ver CV
                                </a>
                            ) : (
                                <p style={{ padding: '12px', background: '#fafafa', border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px', color: '#333' }}>{curriculum_url}</p>
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ color: '#555', fontSize: '15px', fontWeight: '500' }}>Teléfono:</label>
                            <p style={{ padding: '12px', background: '#fafafa', border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px', color: '#333' }}>{telefono}</p>
                        </div>
                        <button
                            onClick={() => navigate('/requisicion/lista')}
                            style={{
                                padding: '12px',
                                background: 'linear-gradient(90deg, #007bff, #0056b3)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                transition: 'background 0.3s',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #0056b3, #003d82)'}
                            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #007bff, #0056b3)'}
                        >
                            Volver a la Lista
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidatoPerfil;