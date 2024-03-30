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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Autocomplete } from '@mui/material';

function ModificarPedido() {
  const listaEstadosPedido = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'PREPARADO', label: 'PREPARADO' },
    { value: 'FINALIZADO', label: 'FINALIZADO' },
    { value: 'CANCELADO', label: 'CANCELADO' }
  ];

  const listaEstadosPago = [
    { value: 'PENDIENTE', label: 'PENDIENTE' },
    { value: 'ABONADO', label: 'ABONADO' }
  ];

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
  const [estadoPago, setEstadoPago] = useState('');
  const [estadoPedido, setEstadoPedido] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState(null);
  const [usuario, setUsuario] = useState(localStorage.getItem('username'));
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [guardarHabilitado, setGuardarHabilitado] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [tipoEstado, setTipoEstado] = useState('');

  useEffect(() => {
    fetch(`https://vivosis-back-v2.vercel.app/api/pedido/${id}`)
      .then(response => response.json())
      .then(data => {
        setPedido(data);
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
    setEstadoPedido(pedido.estado_pedido || '');
    setEstadoPago(pedido.estado_pago || '');
    setComentarios(pedido.comentarios || '');
    setFechaEntrega(pedido.fecha_entrega || null);
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

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }
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

  const handleEstadoPagoChange = event => {    
    setEstadoPago(event.target.value);
  };

  const handleEstadoChange = event => {
    setEstadoPedido(event.target.value);
  };

  const handleComentariosChange = event => {
    setComentarios(event.target.value);
  };

  const handleFechaEntregaChange = newValue => {
    setFechaEntrega(newValue);
  };

  const actualizarStock = (cantidadOriginal, nuevaCantidad) => {
    fetch(`https://vivosis-back-v2.vercel.app/api/producto/${idArticulo}`)
      .then(response => response.json())
      .then(producto => {
        producto.stock += cantidadOriginal;
        producto.stock -= nuevaCantidad;
        guardarCambiosEnProducto(producto);
      })
      .catch(error => {
        console.log('Error al obtener el producto:', error);
      });
  };

  const guardarCambiosEnProducto = producto => {
    fetch(`https://vivosis-back-v2.vercel.app/api/producto/${producto._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(producto)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Stock del producto actualizado:', data);
      })
      .catch(error => {
        console.log('Error al actualizar el stock del producto:', error);
      });
  };

  const handleDialogOpen = (tipoEstado) => {
    setTipoEstado(tipoEstado);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleGuardar = () => {
    setGuardarHabilitado(false);

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
      estado_pedido: estadoPedido,
      estado_pago: estadoPago,
      comentarios,
      fecha_entrega: fechaEntrega,
      usuario,
    };

    const cantidadOriginal = pedido.cantidad;
    fetch(`https://vivosis-back-v2.vercel.app/api/pedido/${id}`, {
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
        actualizarStock(cantidadOriginal, cantidad);
        setTimeout(() => {
          navigate(`/verpedidos`);
        }, 800);
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
              label="Nombre del cliente"
              value={nombreCliente}
              onChange={handleNombreClienteChange}
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
              onKeyDown={handleKeyDown}
              onWheel={(e) => e.target.blur()}
            />
            <br />
            <TextField
              label="Precio"
              type="number"
              value={precio}
              onChange={handlePrecioChange}
              variant="outlined"
              margin="dense"
              onKeyDown={handleKeyDown}
              onWheel={(e) => e.target.blur()}
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
              value={estadoPedido}
              onClick={() => handleDialogOpen('estadoPedido')}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              label="Estado pago"
              value={estadoPago}
              onClick={() => handleDialogOpen('estadoPago')}
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
            <br />
          </form>
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Seleccionar Estado</DialogTitle>
            <DialogContent>
              <Select
                value={tipoEstado === 'estadoPedido' ? estadoPedido : estadoPago}
                onChange={tipoEstado === 'estadoPedido' ? handleEstadoChange : handleEstadoPagoChange}
                variant="outlined"
                margin="dense"
                fullWidth
              >
                {tipoEstado === 'estadoPedido' ? (
                  listaEstadosPedido.map(opcion => (
                    <MenuItem key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </MenuItem>
                  ))
                ) : (
                  listaEstadosPago.map(opcion => (
                    <MenuItem key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </MenuItem>
                  ))
                )}
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancelar</Button>
              <Button onClick={handleDialogClose} color="primary">
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <Box sx={{ mx: 1 }}>
            <Button variant="contained" color="primary" onClick={handleGuardar} disabled={!guardarHabilitado}>
              Guardar
            </Button>
          </Box>
          <Box sx={{ mx: 1 }}>
            <Button variant="contained" color='error' component={Link} to="/verpedidos">
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
