import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, Link, useParams } from 'react-router-dom';
import clients from '../api/graphqlClient';
import { OBTENER_REQUISICION, ACTUALIZAR_REQUISICION, OBTENER_REQUISICIONES } from '../graphql/queries';

interface Requisicion {
    id: string;
    cargo: string;
    categoriaSalarial: string;
    perfil: string;
    funciones: string;
}

const RequisicionDetalle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [cargo, setCargo] = useState<string>('');
    const [categoriaSalarial, setCategoriaSalarial] = useState<string>('');
    const [perfil, setPerfil] = useState<string>('');
    const [funciones, setFunciones] = useState<string>('');
    const [error, setError] = useState<string>('');

    const { data, loading: queryLoading } = useQuery<{ requisicion: Requisicion }>(OBTENER_REQUISICION, {
        client: clients.requisicion,
        variables: { id },
    });

    const [actualizarRequisicion, { loading: mutationLoading }] = useMutation(ACTUALIZAR_REQUISICION, {
        client: clients.requisicion,
        refetchQueries: [{ query: OBTENER_REQUISICIONES }],
    });

    useEffect(() => {
        if (data?.obtenerRequisicionPorId) {
            setCargo(data.obtenerRequisicionPorId.cargo);
            setCategoriaSalarial(data.obtenerRequisicionPorId.categoriaSalarial);
            setPerfil(data.obtenerRequisicionPorId.perfil);
            setFunciones(data.obtenerRequisicionPorId.funciones);
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const currentUser = localStorage.getItem('user') || 'desconocido';
    const currentRole = localStorage.getItem('role') || 'desconocido';

    if (queryLoading) return <div style={{ textAlign: 'center', padding: '50px', color: '#555' }}>Cargando...</div>;
    if (!data?.obtenerRequisicionPorId) return <div style={{ textAlign: 'center', padding: '50px', color: '#d32f2f' }}>Requisición no encontrada.</div>;

    const categoriasSalariales = [
        { value: '', label: 'Seleccione una categoría' },
        { value: 'Nivel 1', label: 'Nivel 1 - $500-$1000' },
        { value: 'Nivel 2', label: 'Nivel 2 - $1000-$1500' },
        { value: 'Nivel 3', label: 'Nivel 3 - $1500-$2000' },
    ];

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

            {/* Formulario */}
            <div style={{ padding: '40px', maxWidth: '700px', margin: '40px auto' }}>
                <div style={{ 
                    background: '#ffffff', 
                    padding: '30px', 
                    borderRadius: '12px', 
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)', 
                    border: '1px solid #e0e0e0' 
                }}>
                    <h2 style={{ textAlign: 'center', color: '#333', fontSize: '28px', marginBottom: '25px', fontWeight: '600' }}>
                        Editar Requisición
                    </h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#555', fontSize: '15px', fontWeight: '500' }}>
                            Cargo:
                            <input
                                type="text"
                                value={cargo}
                                onChange={(e) => setCargo(e.target.value)}
                                readOnly // Hacer el input de solo lectura
                                style={{ 
                                    padding: '12px', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '6px', 
                                    fontSize: '15px', 
                                    outline: 'none', 
                                    transition: 'border-color 0.3s', 
                                    background: '#fafafa' 
                                }}
                            />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#555', fontSize: '15px', fontWeight: '500' }}>
                            Categoría Salarial:
                            <select
                                value={categoriaSalarial}
                                onChange={(e) => setCategoriaSalarial(e.target.value)}
                                readOnly // No es necesario para <select>, usaremos disabled
                                disabled // Para <select>, usamos disabled en lugar de readOnly
                                style={{ 
                                    padding: '12px', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '6px', 
                                    fontSize: '15px', 
                                    outline: 'none', 
                                    transition: 'border-color 0.3s', 
                                    background: '#fafafa', 
                                    cursor: 'not-allowed' 
                                }}
                            >
                                {categoriasSalariales.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#555', fontSize: '15px', fontWeight: '500' }}>
                            Perfil:
                            <textarea
                                value={perfil}
                                onChange={(e) => setPerfil(e.target.value)}
                                readOnly // Hacer el textarea de solo lectura
                                style={{ 
                                    padding: '12px', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '6px', 
                                    fontSize: '15px', 
                                    outline: 'none', 
                                    transition: 'border-color 0.3s', 
                                    minHeight: '120px', 
                                    resize: 'vertical', 
                                    background: '#fafafa' 
                                }}
                            />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#555', fontSize: '15px', fontWeight: '500' }}>
                            Funciones del Cargo:
                            <textarea
                                value={funciones}
                                onChange={(e) => setFunciones(e.target.value)}
                                readOnly // Hacer el textarea de solo lectura
                                style={{ 
                                    padding: '12px', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '6px', 
                                    fontSize: '15px', 
                                    outline: 'none', 
                                    transition: 'border-color 0.3s', 
                                    minHeight: '120px', 
                                    resize: 'vertical', 
                                    background: '#fafafa' 
                                }}
                            />
                        </label>
                        <button
                            onClick={() => navigate('/candidato')}
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
                        {error && <p style={{ color: '#d32f2f', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequisicionDetalle;