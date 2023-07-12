import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';

function CrearPedido() {
  const [id, setId] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [clientes, setClientes] = useState([]);
  const [idArticulo, setIdArticulo] = useState('');
  const [nombreArticulo, setNombreArticulo] = useState('');
  const [articulos, setArticulos] = useState([]);
  const [cantidad, setCantidad] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [total, setTotal] = useState(0);
  const [costo, setCosto] = useState(0);
  const [estadoPedido, setEstadoPedido] = useState('PENDIENTE');
  const [estadoPago, setEstadoPago] = useState('PENDIENTE');
  const [fechaEntrega, setFechaEntrega] = useState(null);
  const [comentarios, setComentarios] = useState('');
  const [usuario, setUsuario] = useState('ADMIN');
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mensajeError, setMensajeError] = useState(false);
  const [valorLocalidad, setValorLocalidad] = useState('');

  const listaLocalidades = [
    { value: '', label: 'VACIO' },
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
    fetch('https://vivosis.vercel.app/api/cliente/getallclientes')
      .then(response => response.json())
      .then(data => {
        setClientes(data);
      })
      .catch(error => {
        console.log('Error al obtener los clientes:', error);
      });

    fetch('https://vivosis.vercel.app/api/producto/getallproductos')
      .then(response => response.json())
      .then(data => {
        setArticulos(data);
      })
      .catch(error => {
        console.log('Error al obtener los productos:', error);
      });
  }, []);

  useEffect(() => {
    const nuevoTotal = cantidad * precio;
    setTotal(nuevoTotal);
  }, [cantidad, precio]);

  const fetchPrecioProducto = productId => {
    fetch(`https://vivosis.vercel.app/api/producto/${productId}`)
      .then(response => response.json())
      .then(data => {
        setPrecio(data.precio);
        setCosto(data.costo);
      })
      .catch(error => {
        console.log('Error al obtener el precio del producto:', error);
      });
  };

  const handleIdChange = event => {
    setId(event.target.value);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMostrarMensaje(false);
    setMensajeError(false);
  };

  const handleIdClienteChange = (event, value) => {
    if (value) {
      setIdCliente(value._id);
      setNombreCliente(value.nombre);
    } else {
      setIdCliente('');
      setNombreCliente('');
    }
  };

  const handleNombreClienteChange = event => {
    setNombreCliente(event.target.value);
  };

  const handleNombreArticuloChange = (event, value) => {
    if (value) {
      setIdArticulo(value._id);
      setNombreArticulo(value.nombre);
      fetchPrecioProducto(value._id);
    } else {
      setIdArticulo('');
      setNombreArticulo('');
      setPrecio(0);
    }
  };

  const handleCantidadChange = event => {
    setCantidad(event.target.value);
  };

  const handlePrecioChange = event => {
    setPrecio(event.target.value);
  };

  const handleTotalChange = event => {
    setTotal(event.target.value);
  };

  const handleCostoChange = event => {
    setCosto(event.target.value);
  };

  const handleEstadoChange = event => {
    setEstadoPedido(event.target.value);
  };

  const handleFechaEntregaChange = newValue => {
    setFechaEntrega(newValue);
  };

  const handleComentariosChange = event => {
    setComentarios(event.target.value);
  };

  const handleUsuarioChange = event => {
    setUsuario(event.target.value);
  };

  const handleLocalidadChange = (event, value) => {
    setValorLocalidad(value ? value.value : ''); // Guardar el valor seleccionado en valorLocalidad
  };

  const limpiarFormulario = () => {
    setId('');
    setIdCliente('');
    setNombreCliente('');
    setIdArticulo('');
    setNombreArticulo('');
    setCantidad(0);
    setPrecio(0);
    setTotal(0);
    setCosto(0);
    setEstadoPedido('Creado');
    setFechaEntrega(null);
    setComentarios('');
    setUsuario('');
    setValorLocalidad('');
  };

  const actualizarStockProducto = (productId, quantity) => {
    fetch(`https://vivosis.vercel.app/api/producto/${productId}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(producto => {
        producto.stock -= quantity;

        fetch(`https://vivosis.vercel.app/api/producto/${productId}`, {
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
      })
      .catch(error => {
        console.log('Error al obtener el producto:', error);
      });
  };

  const handleGuardar = () => {
    if (nombreCliente.trim() === '' || nombreArticulo.trim() === '' || cantidad.trim() === '') {
      setMensaje('El Articulo y cantidad son obligatorios');
      setMensajeError(true);
      setMostrarMensaje(true);
      return;
    }

    const formattedDate = dayjs().format('DD/MM/YYYY');
    const nuevoPedido = {
      fecha: formattedDate,
      id_cliente: idCliente,
      nombre_cliente: nombreCliente,
      id_articulo: idArticulo,
      nombre_articulo: nombreArticulo,
      cantidad: cantidad,
      precio: precio,
      total: total,
      costo: costo,
      estado_pedido: estadoPedido,
      estado_pago: estadoPago,
      fecha_entrega: fechaEntrega ? fechaEntrega.format('DD/MM/YYYY') : null,
      comentarios: comentarios,
      usuario: usuario,
      localidad: valorLocalidad // Usar valorLocalidad en lugar de localidad
    };

    fetch('https://vivosis.vercel.app/api/pedido/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoPedido)
    })
      .then(response => response.json())
      .then(data => {
        setMensaje('¡Pedido creado con éxito!');
        setMensajeError(false);
        setMostrarMensaje(true);

        actualizarStockProducto(idArticulo, cantidad); // Actualizar el stock del producto

        limpiarFormulario();
      })
      .catch(error => {
        console.log('Error al crear el pedido:', error);
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      margin={2}
    >
      <Card> 
        <CardContent>
          <h2>Crear Pedido</h2>
          <form>
            <Autocomplete
              options={clientes}
              getOptionLabel={option => (option.nombre ? option.nombre.toLowerCase() : '')}
              value={nombreCliente ? { _id: idCliente, nombre: nombreCliente } : null}
              onChange={handleIdClienteChange}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Nombre del cliente"
                  variant="outlined"
                  margin="dense"
                />
              )}
              enabled
            />

            <Autocomplete
              options={articulos}
              getOptionLabel={option => (option.nombre ? option.nombre.toLowerCase() : '')}
              value={nombreArticulo ? { id: idArticulo, nombre: nombreArticulo } : null}
              onChange={handleNombreArticuloChange}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Nombre del artículo"
                  variant="outlined"
                  margin="dense"
                />
              )}
              enabled
            />

            <TextField
              fullWidth
              label="Cantidad"
              type="number"
              value={cantidad}
              onChange={handleCantidadChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              fullWidth
              label="Precio"
              type="number"
              value={precio}
              onChange={handlePrecioChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              fullWidth
              label="Total"
              type="number"
              value={total}
              onChange={handleTotalChange}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <TextField
              fullWidth
              label="Costo"
              type="number"
              value={costo}
              onChange={handleCostoChange}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <TextField
              fullWidth
              label="Estado"
              value={estadoPedido}
              onChange={handleEstadoChange}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
              
                label="Fecha de entrega"
                value={fechaEntrega}
                onChange={handleFechaEntregaChange}
                renderInput={params => (
                  <TextField
                    
                    {...params}
                    margin="dense"
                    variant="outlined"
                  />
                )}
              />
            </LocalizationProvider>
            <br />
            <Autocomplete
              options={listaLocalidades}
              getOptionLabel={option => option.label}
              value={listaLocalidades.find(localidad => localidad.value === valorLocalidad) || ''}
              onChange={handleLocalidadChange}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Localidad"
                  variant="outlined"
                  margin="dense"
                />
              )}
              enabled
            />
            <br />
            <TextField
              fullWidth
              label="Comentarios"
              value={comentarios}
              onChange={handleComentariosChange}
              variant="outlined"
              margin="dense"
              multiline
              rows={4}
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
            <Link to="/verpedidos">
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
            severity={mensajeError ? 'error' : 'success'}
          >
            {mensaje}
          </MuiAlert>
        </Snackbar>
      </Card>
    </Box>
  );
}

export default CrearPedido;
