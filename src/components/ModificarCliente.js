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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';



function ModificarCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [cliente, setCliente] = useState({});
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [estado, setEstado] = useState('');
  const [usuario, setUsuario] = useState(localStorage.getItem('username'));
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [guardarHabilitado, setGuardarHabilitado] = useState(true);  
  const [openDialog, setOpenDialog] = useState(false);
  const [localidadDialog, setLocalidadDialog] = useState('');
  const [localidadesDialog, setLocalidadesDialog] = useState([]);
  
  
  

  
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


  useEffect(() => {
    fetch(`https://vivosis.vercel.app/api/cliente/${id}`)
      .then(response => response.json())
      .then(data => {
        setCliente(data);
        
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
    setLocalidadesDialog(listaLocalidades);
  }, [cliente]);


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleLocalidadDialogChange = event => {
    const selectedCategoria = event.target.value;
    setLocalidadDialog(selectedCategoria);    
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNombreChange = event => {
    setNombre(event.target.value);
  };

  const handleTelefonoChange = event => {
    setTelefono(event.target.value);
  };
  const handleCloseDialogCancel = () => {
    setOpenDialog(false);
  };
  
  const handleCloseDialogSave = () => {
    setOpenDialog(false);
    setLocalidad(localidadDialog);
/*    const selectedLocalidadObj = localidadesDialog.find(c => c._id === localidadDialog);
    if (selectedLocalidadObj) {      
      setLocalidad(selectedLocalidadObj.nombre);
      
      
    }
    */
    
    
    
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
        
        setMensaje('El cliente ha sido actualizado');
        setMostrarMensaje(true);
        
        setTimeout(() => {
          navigate(`/verclientes`);
        }, 800);
        
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
              onClick={handleOpenDialog}
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
                <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                <MenuItem value="BLOQUEADO">BLOQUEADO</MenuItem>
              </Select>
            </FormControl>
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Seleccionar localidad</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Localidad"
            value={localidadDialog}
            onChange={handleLocalidadDialogChange}
            variant="outlined"
            margin="dense"
          >
            {localidadesDialog.map(localidad => (
              <MenuItem key={localidad.value} value={localidad.value}>
                {localidad.label}
              </MenuItem>
            ))}
          </TextField>                    
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogCancel} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleCloseDialogSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
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
