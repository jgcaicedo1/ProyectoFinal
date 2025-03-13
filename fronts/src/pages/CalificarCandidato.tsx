import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

const CalificarCandidato: React.FC = () => {
  const { candidatoId } = useParams<{ candidatoId: string }>(); // Obtener el ID del candidato desde la URL
  const navigate = useNavigate();
  
  const [calificacion, setCalificacion] = useState<number | ''>('');
  const [observaciones, setObservaciones] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState<'success' | 'danger'>('success');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (calificacion === '' || calificacion < 0 || calificacion > 20) {
      setAlertMessage('Por favor, ingrese una calificación válida entre 0 y 20.');
      setAlertVariant('danger');
      setShowAlert(true);
      return;
    }

    // Aquí puedes agregar la lógica para guardar la calificación y observaciones (por ejemplo, una mutación de GraphQL)
    console.log({
      candidatoId,
      calificacion,
      observaciones,
    });

    setAlertMessage('Calificación enviada con éxito.');
    setAlertVariant('success');
    setShowAlert(true);

    // Limpiar el formulario después de enviar
    setCalificacion('');
    setObservaciones('');
  };

  const handleRegresar = () => {
    navigate(-1); // Regresa a la página anterior
  };

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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
            Calificar Candidato
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: 'white', fontSize: '16px', fontWeight: '400' }}>
            ID del Candidato: {candidatoId}
          </span>
        </div>
      </nav>

      {/* Contenido */}
      <div style={{ padding: '40px', margin: '20px auto', maxWidth: '600px' }}>
        {showAlert && (
          <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}

        <h2 style={{ textAlign: 'center', color: '#333', fontSize: '28px', marginBottom: '30px', fontWeight: '600' }}>
          Calificación del Candidato
        </h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="calificacion">
            <Form.Label>Calificación (0-20)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese la calificación"
              value={calificacion}
              onChange={(e) => setCalificacion(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
              max={100}
              required
              style={{ borderRadius: '8px', padding: '10px', fontSize: '16px' }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="observaciones">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Ingrese sus observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              style={{ borderRadius: '8px', padding: '10px', fontSize: '16px' }}
            />
          </Form.Group>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
            <Button
              variant="secondary"
              onClick={handleRegresar}
              style={{ 
                padding: '10px 20px', 
                fontSize: '16px', 
                fontWeight: '600', 
                borderRadius: '8px', 
                width: '48%', 
                transition: 'background 0.3s' 
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#5a6268')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#6c757d')}
            >
              Regresar
            </Button>

            <Button
              variant="primary"
              type="submit"
              style={{ 
                padding: '10px 20px', 
                fontSize: '16px', 
                fontWeight: '600', 
                borderRadius: '8px', 
                width: '48%', 
                transition: 'background 0.3s' 
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#0056b3')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#007bff')}
            >
              Enviar Calificación
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CalificarCandidato;