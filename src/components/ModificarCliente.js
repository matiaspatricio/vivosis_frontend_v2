import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

function ModificarCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [cliente, setCliente] = useState({});
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [estado, setEstado] = useState('');
  const [usuario, setUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [guardarHabilitado, setGuardarHabilitado] = useState(true);

  useEffect(() => {
    fetch(`https://vivosis.vercel.app/api/cliente/${id}`)
      .then(response => response.json())
      .then(data => {
        setCliente(data);
        console.log(data.data.nombre)
      })
      .catch(error => {
        console.log('Error al cargar el cliente:', error);
      });
  }, [id]);

  useEffect(() => {
    setNombre(cliente.nombre || '');
    setTelefono(cliente.telefono || '');
    setDireccion(cliente.direccion || '');
    setLocalidad(cliente.localidad || '');
    setEstado(cliente.estado || '');
    setUsuario(cliente.usuario || '');
  }, [cliente]);

  const handleNombreChange = event => {
    setNombre(event.target.value);
  };

  const handleTelefonoChange = event => {
    setTelefono(event.target.value);
  };

  const handleDireccionChange = event => {
    setDireccion(event.target.value);
  };

  const handleLocalidadChange = event => {
    setLocalidad(event.target.value);
  };

  const handleEstadoChange = event => {
    setEstado(event.target.value);
  };

  const handleUsuarioChange = event => {
    setUsuario(event.target.value);
  };

  const handleGuardar = () => {
    setGuardarHabilitado(false);
    const clienteModificado = {
      ...cliente,
      nombre,
      telefono,
      direccion,
      localidad,
      estado,
      usuario
    };
    fetch(`https://vivosis.vercel.app/api/cliente/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clienteModificado)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Cliente modificado:', data);
        setMensaje('El cliente ha sido actualizado');
        setMostrarMensaje(true);
        navigate(`/ModificarCliente/${id}`);
      })
      .catch(error => {
        console.log('Error al modificar el cliente:', error);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMostrarMensaje(false);
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
          <h2>Modificar Cliente</h2>
          <form>
            <TextField
              label="Nombre"
              value={nombre}
              onChange={handleNombreChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              label="Teléfono"
              value={telefono}
              onChange={handleTelefonoChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              label="Dirección"
              value={direccion}
              onChange={handleDireccionChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              label="Localidad"
              value={localidad}
              onChange={handleLocalidadChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel id="estado-label" >Estado</InputLabel>
              <Select 
                
                labelId="estado-label"
                value={estado}
                onChange={handleEstadoChange}
                label="Estado"
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Bloqueado">Bloqueado</MenuItem>
              </Select>
            </FormControl>
            <br />
            <TextField
              label="Usuario"
              value={usuario}
              onChange={handleUsuarioChange}
              variant="outlined"
              margin="dense"
            />
            <br />
          </form>
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <Box sx={{ mx: 1 }}>
            <Button variant="contained" color="primary" onClick={handleGuardar}>
              Guardar
            </Button>
          </Box>
          <Box sx={{ mx: 1 }}>
            <Button variant="contained" color="secondary" component={Link} to="/verclientes">
              Atrás
            </Button>
          </Box>
        </CardActions>
      </Card>

      <Snackbar
        open={mostrarMensaje}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="success"
        >
          {mensaje}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default ModificarCliente;
