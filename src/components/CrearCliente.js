import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function CrearCliente() {
  const listaLocalidades = [
    { value: 'AVELLANEDA', label: 'AVELLANEDA' },
    { value: 'BERAZATEGUI', label: 'BERAZATEGUI' },
    { value: 'CRUCE VARELA', label: 'CRUCE VARELA' },
    { value: 'ENVIO CORREO', label: 'ENVIO CORREO' },
    { value: 'ENVIO MENSAJERIA', label: 'ENVIO MENSAJERIA' },
    { value: 'EZPELETA', label: 'EZPELETA' },
    { value: 'LANUS', label: 'LANUS' },
    { value: 'LOMAS', label: 'LOMAS' },
    { value: 'QUILMES', label: 'QUILMES' },
    { value: 'RETIRO EN DOMICILIO', label: 'RETIRO EN DOMICILIO' },
    { value: 'SOLANO', label: 'SOLANO' },
    { value: 'VARELA', label: 'VARELA' }
  ];

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [usuario, setUsuario] = useState('admin');
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mensajeError, setMensajeError] = useState(false);

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleTelefonoChange = (event) => {
    setTelefono(event.target.value);
  };

  const handleDireccionChange = (event) => {
    setDireccion(event.target.value);
  };

  const handleLocalidadChange = (event, newValue) => {
    setLocalidad(newValue.value);
  };

  const handleEstadoChange = (event) => {
    setEstado(event.target.value);
  };

  const handleUsuarioChange = (event) => {
    setUsuario(event.target.value);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setTelefono('');
    setDireccion('');
    setLocalidad('');
    setEstado('Activo');
    setUsuario('admin');
  };

  const handleGuardar = () => {
    if (nombre.trim() === '') {
      setMensaje('El campo Nombre es obligatorio');
      setMensajeError(true);
      setMostrarMensaje(true);
      return;
    }
  
    const nuevoCliente = {
      nombre,
      telefono,
      direccion,
      localidad,
      estado,
      usuario
    };
    fetch('https://vivosis.vercel.app/api/cliente/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoCliente)
    })
      .then((response) => response.json())
      .then((data) => {        
        setMensaje('¡Cliente creado con éxito!');
        setMensajeError(false);
        setMostrarMensaje(true);
        limpiarFormulario();
      })
      .catch((error) => {
        console.log('Error al crear el cliente:', error);
      });
  };
  

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMostrarMensaje(false);
    setMensajeError(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Card>
        <CardContent>
          <h2>Crear Cliente</h2>
          <form>
            <TextField
              fullWidth 
              label="Nombre"
              value={nombre}
              onChange={handleNombreChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              fullWidth 
              label="Teléfono"
              value={telefono}
              onChange={handleTelefonoChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              fullWidth
              label="Dirección"
              value={direccion}
              onChange={handleDireccionChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <Autocomplete
                disableClearable={true}
              fullWidth                                          
              onChange={handleLocalidadChange}
              options={listaLocalidades}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Localidad"
                  variant="outlined"
                  margin="dense"
                />
              )}
            />
            <br />
            <TextField
              fullWidth 
              label="Estado"
              value={estado}
              onChange={handleEstadoChange}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <TextField
              fullWidth 
              label="Usuario"
              value={usuario}
              onChange={handleUsuarioChange}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
          </form>
        </CardContent>
        <CardActions>
          <Box sx={{ mx: 0.25 }}>
            <Button variant="contained" color="primary" onClick={handleGuardar} margin="dense">
              Guardar
            </Button>
          </Box>
          <Box sx={{ mx: 0.25 }}>
            <Button variant="contained" color="secondary" onClick={limpiarFormulario} margin="dense">
              Limpiar
            </Button>
          </Box>
          <Box sx={{ mx: 0.25 }}>
            <Link to="/verclientes">
              <Button variant="contained" color="error" margin="dense">
                Cancelar
              </Button>
            </Link>
          </Box>
        </CardActions>
        
        <Snackbar
          open={mostrarMensaje}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
             >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={mensajeError ? "error" : "success"}
        >
          {mensaje}
        </MuiAlert>
      </Snackbar>
      </Card>

    </Box>
  );
}

export default CrearCliente;
