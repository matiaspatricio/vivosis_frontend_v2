import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

function ModificarPedido() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pedido, setPedido] = useState({});
  const [fecha, setFecha] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [idArticulo, setIdArticulo] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [nombreArticulo, setNombreArticulo] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [total, setTotal] = useState(0);
  const [costo, setCosto] = useState(0);
  const [estado, setEstado] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState(null); // Nuevo estado para la fecha de entrega
  const [usuario, setUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    fetch(`https://vivosis.vercel.app/api/pedido/${id}`)
      .then(response => response.json())
      .then(data => {
        setPedido(data);
        console.log(data);
      })
      .catch(error => {
        console.log('Error al cargar el pedido:', error);
      });
  }, [id]);

  useEffect(() => {
    setFecha(pedido.fecha || '');
    setIdCliente(pedido.id_cliente || '');
    setIdArticulo(pedido.id_articulo || '');
    setNombreCliente(pedido.nombre_cliente || '');
    setNombreArticulo(pedido.nombre_articulo || '');
    setCantidad(pedido.cantidad || 0);
    setPrecio(pedido.precio || 0);
    setTotal(pedido.total || 0);
    setCosto(pedido.costo || 0);
    setEstado(pedido.estado || '');
    setComentarios(pedido.comentarios || '');
    setFechaEntrega(pedido.fecha_entrega || ''); // Nuevo estado para la fecha de entrega
    setUsuario(pedido.usuario || '');
  }, [pedido]);

  useEffect(() => {
    const calcularTotal = () => {
      const precioFloat = parseFloat(precio);
      const cantidadFloat = parseFloat(cantidad);
      if (isNaN(precioFloat) || isNaN(cantidadFloat)) {
        return 0;
      }
      return (precioFloat * cantidadFloat).toFixed(2);
    };

    setTotal(calcularTotal());
  }, [precio, cantidad]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  }; 

  const handleFechaChange = event => {
    setFecha(event.target.value);
  };

  const handleIdClienteChange = event => {
    setIdCliente(event.target.value);
  };

  const handleIdArticuloChange = event => {
    setIdArticulo(event.target.value);
  };

  const handleNombreClienteChange = event => {
    setNombreCliente(event.target.value);
  };

  const handleNombreArticuloChange = event => {
    setNombreArticulo(event.target.value);
  };

  const handleCantidadChange = event => {
    setCantidad(event.target.value);
  };

  const handlePrecioChange = event => {
    setPrecio(event.target.value);
  };

  const handleCostoChange = event => {
    setCosto(event.target.value);
  };

  const handleEstadoChange = event => {
    setEstado(event.target.value);
  };

  const handleComentariosChange = event => {
    setComentarios(event.target.value);
  };

  const handleFechaEntregaChange = newValue => {
    const fecha2 =  newValue.toISOString();            
    setFechaEntrega(newValue);
  }; // Nuevo manejador de cambio para la fecha de entrega

  const handleUsuarioChange = event => {
    setUsuario(event.target.value);
  };

  const handleGuardar = () => {
    
    const pedidoModificado = {
      ...pedido,
      fecha: fecha,
      id_cliente: idCliente,
      nombre_cliente: nombreCliente,
      id_articulo: idArticulo,
      nombre_articulo: nombreArticulo,
      cantidad,
      precio,
      total,
      costo,
      estado,
      comentarios,
      fecha_entrega : fechaEntrega, // Agregar fecha de entrega al objeto del pedido modificado
      usuario,
    };
    fetch(`https://vivosis.vercel.app/api/pedido/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedidoModificado),
    })
      .then(response => response.json())
      .then(data => {
        setMensaje('El pedido ha sido actualizado');
        setMostrarMensaje(true);
        navigate(`/ModificarPedido/${id}`);
        
      })
      .catch(error => {
        console.log('Error al modificar el pedido:', error);
      });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card>
        <CardContent>
          <h2>Modificar Pedido</h2>
          <form>
            <TextField
              label="Fecha"
              value={fecha}
              onChange={handleFechaChange}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <TextField
              label="ID del Cliente"
              value={idCliente}
              onChange={handleIdClienteChange}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />            
            <TextField
              label="Nombre del cliente"
              value={nombreCliente}
              onChange={handleNombreClienteChange}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <TextField
              label="ID del Artículo"
              value={idArticulo}
              onChange={handleIdArticuloChange}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <TextField
              label="Nombre del artículo"
              value={nombreArticulo}
              onChange={handleNombreArticuloChange}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <TextField
              label="Cantidad"
              type="number"
              value={cantidad}
              onChange={handleCantidadChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              label="Precio"
              type="number"
              value={precio}
              onChange={handlePrecioChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              label="Total"
              type="number"
              value={total}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <TextField
              label="Costo por unidad"
              type="number"
              value={costo}
              onChange={handleCostoChange}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <TextField
              label="Estado"
              value={estado}
              onChange={handleEstadoChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              label="Comentarios"
              value={comentarios}
              onChange={handleComentariosChange}
              variant="outlined"
              margin="dense"
              multiline
              rows={4}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs } locale="es">
              <DemoContainer components={['DatePicker']} >
                <DatePicker
                  label="Fecha de entrega"
                  value={dayjs(fechaEntrega)}
                  onChange={handleFechaEntregaChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      variant="outlined"
                    />
                  )}
                />
              </DemoContainer>  
            </LocalizationProvider>
            <br />            
            <TextField
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
        <CardActions style={{ justifyContent: 'center' }}>
          <Box sx={{ mx: 1 }}>
            <Button variant="contained" color="primary"onClick={handleGuardar}>
              Guardar
            </Button>
          </Box>
          <Box sx={{ mx: 1 }}>
            <Button variant="contained" component={Link} to="/verpedidos">
              Atrás
            </Button>
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
          severity="success"
        >
          {mensaje}
        </MuiAlert>
      </Snackbar>
      </Card>
    </Box>
  );
}

export default ModificarPedido;
