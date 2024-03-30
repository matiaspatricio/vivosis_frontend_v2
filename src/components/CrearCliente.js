import React, { useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getPuntosEntrega  } from './api/puntoEntrega/puntoEntrega';
import { listaEstados, listaOrigenes } from './api/cliente/cliente';

function CrearCliente() {  

  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');  
  const [puntoEntrega, setPuntoEntrega] = useState('');
  const [email, setEmail] = useState('');
  const [comentarios, setComentarios] = useState('');  
  const [estado, setEstado] = useState('');
  const [origen, setOrigen] = useState('');
  const [usuario, setUsuario] = useState(localStorage.getItem('username'));

  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mensajeError, setMensajeError] = useState(false);
  
  const [listaPuntosEntrega, setListaPuntosEntrega] = useState([]);

  useEffect(() => {

    const fetchPuntosEntrega = async () => {
      const listaPuntosEntrega = await getPuntosEntrega();        
      setListaPuntosEntrega(listaPuntosEntrega);         
    }       
    fetchPuntosEntrega();

  }, []);

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleTelefonoChange = (event) => {
    setTelefono(event.target.value);
  };

  const handleDireccionChange = (event) => {
    setDireccion(event.target.value);
  };


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleEstadoChange = (event) => {
    setEstado(event.target.value);
  };
  const handlePuntoEntregaChange = event => {
    setPuntoEntrega(event.target.value);
  };
  const handleComentariosChange = event => {
    setComentarios(event.target.value);
  };
  const handleOrigenChange = event => {
    setOrigen(event.target.value);
  };


  const limpiarFormulario = () => {
    setNombre('');
    setTelefono('');
    setDireccion('');
    setPuntoEntrega('');
    setEmail('');       
    setEstado('');
    setComentarios('');
    setOrigen('');        
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
      punto_entrega : puntoEntrega,
      email,
      estado,
      comentarios,
      origen
    };
    console.log('nuevoCliente:', nuevoCliente)
    fetch('https://vivosis-back-v2.vercel.app/api/cliente/', {
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
        setTimeout(() => {
          navigate(`/verclientes`);
        }, 800);
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
            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel id="punto_entrega-label" >Punto de Entrega</InputLabel>
              <Select
                labelId="punto_entrega-label"
                value={puntoEntrega}
                onChange={handlePuntoEntregaChange}
                label="Punto de Entrega"
              >
                {listaPuntosEntrega && listaPuntosEntrega.map(puntoEntrega => (
                  <MenuItem key={puntoEntrega.id} value={puntoEntrega.id}>
                    {puntoEntrega.nombre}
                  </MenuItem>
                ))}
              </Select>

            </FormControl>
            <br />                  
            <TextField
              fullWidth 
              label="Email"
              value={email}
              onChange={handleEmailChange}
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
                {listaEstados && listaEstados.map(estado => (
                  <MenuItem key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </MenuItem>
                ))}
              </Select>

            </FormControl>
            <br />        

            <TextField
              fullWidth 
              label="Comentarios"
              value={comentarios}
              onChange={handleComentariosChange}
              variant="outlined"
              margin="dense"
              
            />
            <br />
            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel id="origen-label" >Origen</InputLabel>
              <Select
                labelId="origen-label"
                value={origen}
                onChange={handleOrigenChange}
                label="Origen"
              >
                {listaOrigenes && listaOrigenes.map(origen => (
                  <MenuItem key={origen.id} value={origen.id}>
                    {origen.nombre}
                  </MenuItem>
                ))}
              </Select>

            </FormControl>
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
