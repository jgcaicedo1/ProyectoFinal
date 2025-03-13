import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PublicacionList from './pages/PublicacionList';
import RequisicionForm from './pages/RequisicionForm';
import RequisicionList from './pages/RequisicionList';
import RequisicionListRRHH from './pages/RequisicionListRRHH';
import CandidatosList from './pages/CandidatosList';
import CalificarCandidato from './pages/CalificarCandidato';
import Candidatos from './pages/Candidatos';
import RequisicionEdit from './pages/RequisicionEdit';
import RequisicionDetalle from './pages/RequisicionDetalle';
import PostulaDetalle from './pages/PostulaDetalle';
import CandidatoPerfil from './pages/CandidatoPerfil';

const App: React.FC = () => {
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setUserRole(storedRole);
        }

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'role' && !event.newValue) {
                setUserRole(null); // Cerrar sesión en esta pestaña
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogin = (role: string) => {
        setUserRole(role);
        localStorage.setItem('role', role);
    };

    const handleLogout = () => {
        setUserRole(null);
        localStorage.removeItem('role');
        localStorage.removeItem('user');
    };

    return (
        <Router>
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={!userRole ? <Navigate to="/login" /> : <Navigate to={`/${userRole}`} />} />
                    <Route path="/areaSolicitante" element={userRole === 'areaSolicitante' ? <AreaSolicitantePages /> : <Navigate to="/login" />} />
                    <Route path="/requisicion/nueva" element={<RequisicionForm />} />
                    <Route path="/requisicion/lista" element={<RequisicionList />} />
                    <Route path="/directorRRHH" element={userRole === 'directorRRHH' ? <DirectorRRHHPages /> : <Navigate to="/login" />} />
                    <Route path="/requisicion/rrhh" element={<RequisicionListRRHH />} />
                    <Route path="/candidatos" element={<Candidatos />} />
                    <Route path="/profesionalSeleccion" element={userRole === 'profesionalSeleccion' ? <ProfesionalSeleccionPages /> : <Navigate to="/login" />} />
                    <Route path="/publicaciones" element={<PublicacionList />} />
                    <Route path="/candidatos" element={<Candidatos />} />
                    <Route path="/psicologo" element={userRole === 'psicologo' ? <PsicologoPages /> : <Navigate to="/login" />} />
                    <Route path="/candidatos/lista" element={<Candidatos />} />
                    <Route path="/calificar/:candidatoId" element={<CalificarCandidato />} />
                    <Route path="/jefeInmediato" element={userRole === 'jefeInmediato' ? <JefeInmediatoPages /> : <Navigate to="/login" />} />
                    <Route path="/candidatos/lista" element={<Candidatos />} />
                    <Route path="/candidatoInterno" element={userRole === 'candidatoInterno' ? <CandidatoPages /> : <Navigate to="/login" />} />
                    <Route path="/candidatoExterno" element={userRole === 'candidatoExterno' ? <CandidatoPages /> : <Navigate to="/login" />} />
                    <Route path="/propuestas" element={<CandidatosList />} />
                    <Route path="/requisicion/editar/:id" element={<RequisicionEdit />} />
                    <Route path="/requisicion/detalle/:id" element={<RequisicionDetalle />} />
                    <Route path="/postular/detalle/:id" element={<PostulaDetalle />} />
                    <Route path="/candidato/:id" element={<CandidatoPerfil />} />
                </Routes>
        </Router>
    );
};

// Componentes para cada rol
const AreaSolicitantePages: React.FC = () => (
    <>
        <RequisicionForm />
        <RequisicionList />
    </>
);

const DirectorRRHHPages: React.FC = () => (
    <>
        <RequisicionListRRHH />
        <Candidatos />
    </>
);

const ProfesionalSeleccionPages: React.FC = () => (
    <>
        <PublicacionList />
        <Candidatos />
    </>
);

const PsicologoPages: React.FC = () => (
    <>
        <Candidatos />
    </>
);

const JefeInmediatoPages: React.FC = () => (
    <>
        <Candidatos />
    </>
);

const CandidatoPages: React.FC = () => (
    <>
        <CandidatosList />
    </>
);

export default App;