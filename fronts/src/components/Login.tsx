// src/components/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface User {
    password: string;
    role: string;
    area?: string
}

interface Users {
    [key: string]: User;
}

// Simulación de los datos de la tabla 'usuarios' de PostgreSQL
const users: Users = {
    areaSolicitante1: { password: "pass123", role: "areaSolicitante", area: "1" },
    areaSolicitante2: { password: "pass124", role: "areaSolicitante", area: "2" },
    areaSolicitante3: { password: "pass125", role: "areaSolicitante", area: "3" },
    directorRRHH1: { password: "pass456", role: "directorRRHH"},
    profesionalSeleccion1: { password: "pass789", role: "profesionalSeleccion" },
    psicologo1: { password: "pass101", role: "psicologo" },
    jefeInmediato1: { password: "pass102", role: "jefeInmediato", area: "1" },
    jefeInmediato2: { password: "pass103", role: "jefeInmediato", area: "2" },
    candidato1: { password: "pass103", role: "candidatoInterno" },
    candidato2: { password: "pass103", role: "candidatoExterno" },
};

const Login: React.FC<{ onLogin: (role: string) => void }> = ({ onLogin }) => {
    const [user, setUser] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');
        if (storedUser && storedRole && users[storedUser]) {
            setIsUserLoggedIn(true);
            onLogin(storedRole);
            navigate(`/${storedRole}`);
        }

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'role' && !event.newValue) {
                setIsUserLoggedIn(false);
                navigate('/login');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [navigate, onLogin]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user || !password) {
            setError('Por favor, ingrese usuario y contraseña');
            return;
        }

        setError('');

        if (users[user] && users[user].password === password) {
            const userRole = users[user].role;
            const area = users[user].area;
            localStorage.setItem('role', userRole);
            localStorage.setItem('user', user);
            localStorage.setItem('area', area != null ? area : "");
            setIsUserLoggedIn(true);
            onLogin(userRole);
            navigate(`/${userRole}`);
        } else {
            setError('Usuario o contraseña inválidos');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        setIsUserLoggedIn(false);
        setUser('');
        setPassword('');
        setError('');
        setShowLogoutConfirmation(false);
        navigate('/login');
    };

    const handleLogoutRequest = () => {
        setShowLogoutConfirmation(true);
    };

    const cancelLogout = () => {
        setShowLogoutConfirmation(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#333', fontSize: '24px', fontWeight: '600', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <span role="img" aria-label="personas" style={{ fontSize: '32px' }}>👥</span>
                    Bienvenido al Sistema de Postulación y Selección de Personal
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '340px', padding: '30px', background: '#ffffff', boxShadow: '0 8px 16px rgba(0,0,0,0.15)', borderRadius: '12px', gap: '20px' }}>
                    <h2 style={{ textAlign: 'center', color: '#333', fontSize: '24px', marginBottom: '10px', fontFamily: 'Arial, sans-serif' }}>Iniciar Sesión</h2>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                        Usuario:
                        <input
                            type="text"
                            placeholder="Ingrese su usuario"
                            value={user}
                            onChange={e => setUser(e.target.value)}
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }}
                        />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                        Contraseña:
                        <input
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }}
                        />
                    </label>
                    <button
                        type="submit"
                        style={{
                            padding: '12px',
                            background: 'linear-gradient(90deg, #007bff, #0056b3)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            transition: 'background 0.3s, transform 0.2s',
                        }}
                    >
                        Iniciar Sesión
                    </button>
                    {error && <p style={{ color: '#d32f2f', marginTop: '5px', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>{error}</p>}
                </form>
                {!isUserLoggedIn && (
                    <Link to="/register" style={{ color: '#007bff', fontSize: '14px', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = '#0056b3'} onMouseOut={e => e.currentTarget.style.color = '#007bff'}>
                        ¿Eres nuevo postulante? Ingresa tus datos aquí
                    </Link>
                )}
                {showLogoutConfirmation && (
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', zIndex: 1000 }}>
                        <p style={{ marginBottom: '20px', color: '#333' }}>¿Estás seguro de que deseas cerrar sesión?</p>
                        <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px', cursor: 'pointer' }}>Sí</button>
                        <button onClick={cancelLogout} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>No</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;