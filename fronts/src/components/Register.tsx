// src/components/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
    const [nombres, setNombres] = useState<string>('');
    const [apellidos, setApellidos] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefono, setTelefono] = useState<string>('');
    const [usuario, setUsuario] = useState<string>('');
    const [contrasena, setContrasena] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (nombres && apellidos && correo && telefono && usuario && contrasena) {
            localStorage.setItem('role', 'candidato');
            localStorage.setItem('user', usuario);
            navigate('/login');
        } else {
            setError('Por favor, completa todos los campos');
        }
    };

    return (
        <div 
            style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
            }}
        >
            <div 
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '20px' 
                }}
            >
                <form 
                    onSubmit={handleSubmit} 
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        width: '400px', 
                        padding: '30px', 
                        background: '#ffffff', 
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)', 
                        borderRadius: '12px', 
                        gap: '20px' 
                    }}
                >
                    <h2 
                        style={{ 
                            textAlign: 'center', 
                            color: '#333', 
                            fontSize: '24px', 
                            marginBottom: '10px', 
                            fontFamily: 'Arial, sans-serif' 
                        }}
                    >
                        Registro de Nuevo Postulante
                    </h2>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                        Nombres:
                        <input type="text" placeholder="Ingrese sus nombres" value={nombres} onChange={e => setNombres(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                        Apellidos:
                        <input type="text" placeholder="Ingrese sus apellidos" value={apellidos} onChange={e => setApellidos(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                        Correo:
                        <input type="email" placeholder="Ingrese su correo" value={correo} onChange={e => setCorreo(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                        Teléfono:
                        <input type="tel" placeholder="Ingrese su teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                        Usuario:
                        <input type="text" placeholder="Cree su usuario" value={usuario} onChange={e => setUsuario(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                        Contraseña:
                        <input type="password" placeholder="Cree su contraseña" value={contrasena} onChange={e => setContrasena(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} />
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
                            transition: 'background 0.3s, transform 0.2s' 
                        }}
                    >
                        Registrarse
                    </button>
                    {error && (
                        <p 
                            style={{ 
                                color: '#d32f2f', 
                                marginTop: '5px', 
                                textAlign: 'center', 
                                fontSize: '14px', 
                                fontWeight: '500' 
                            }}
                        >
                            {error}
                        </p>
                    )}
                </form>
                <Link 
                    to="/login" 
                    style={{ 
                        color: '#007bff', 
                        fontSize: '14px', 
                        textDecoration: 'none', 
                        fontWeight: '500', 
                        transition: 'color 0.3s' 
                    }}
                    onMouseOver={e => e.currentTarget.style.color = '#0056b3'}
                    onMouseOut={e => e.currentTarget.style.color = '#007bff'}
                >
                    Volver al Inicio de Sesión
                </Link>
            </div>
        </div>
    );
};

export default Register;