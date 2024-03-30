import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime'
import Divider from '@mui/material/Divider';

import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

function ActualizaMasivaPedidos() {
  const [guardarHabilitado, setGuardarHabilitado] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedClientes, setSelectedClientes] = useState([]);
  const [selectedFechaEntrega, setSelectedFechaEntrega] = useState(null);

  

  const [localidades, setLocalidades] = useState([]);
  const [selectedLocalidad, setSelectedLocalidad] = useState('');
  const [estadosPedido, setEstadosPedido] = useState([]);
  const [selectedEstadoPedido, setSelectedEstadoPedido] = useState('');
  const [selectedFechaCreacion, setSelectedFechaCreacion] = useState('');

  
  const [estadosPago, setEstadosPago] = useState([]);
  const [selectedEstadoPago, setSelectedEstadoPago] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mensajeError, setMensajeError] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [checkFechaEntrega, setCheckFechaEntrega] = useState(false);
  const [checkLocalidad, setCheckLocalidad] = useState(false);
  const [checkEstadoPedido, setCheckEstadoPedido] = useState(false);
  const [checkEstadoPago, setCheckEstadoPago] = useState(false);


  useEffect(() => {
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
    const estadosPedido = [
      { value: 'PENDIENTE', label: 'PENDIENTE' },
      { value: 'PREPARADO', label: 'PREPARADO' },
      { value: 'FINALIZADO', label: 'FINALIZADO' },
      { value: 'CANCELADO', label: 'CANCELADO' }
    ];

    const estadosPago = [
      { value: 'PENDIENTE', label: 'PENDIENTE' },
      { value: 'ABONADO', label: 'ABONADO' }
    ];

    const fetchPedidos = async () => {
      try {
        const response = await axios.get('https://vivosis-back-v2.vercel.app/api/pedido/getpedidospendientes');
        const data = response.data;
        setPedidos(data);
        const uniqueClientes = Array.from(new Set(data.map(pedido => pedido.nombre_cliente)));
        setClientes(uniqueClientes);
      } catch (error) {
        console.log('Error al obtener los pedidos:', error);
      }
    };

    setLocalidades(listaLocalidades);

    fetchPedidos();
    setEstadosPedido(estadosPedido);
    setEstadosPago(estadosPago);
  }, []);

  const handleClientesChange = (event, values) => {
    setSelectedClientes(values);
  };

  const handleFechaEntregaChange = newValue => {
    setSelectedFechaEntrega(newValue);
  };

  const handleLocalidadChange = event => {
    setSelectedLocalidad(event.target.value);
  };

  const handleEstadoPedidoChange = event => {
    setSelectedEstadoPedido(event.target.value);
  };

  const handleEstadoPagoChange = event => {
    setSelectedEstadoPago(event.target.value);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMostrarMensaje(false);
    setMensajeError(false);
  };
  const handleCheckFechaEntregaChange = event => {
    setCheckFechaEntrega(event.target.checked);
  };

  const handleCheckLocalidadChange = event => {
    setCheckLocalidad(event.target.checked);
  };

  const handleCheckEstadoPedidoChange = event => {
    setCheckEstadoPedido(event.target.checked);
  };

  const handleFechaCreacionChange = event => {
    setSelectedFechaCreacion(event);
  };

  const handleCheckEstadoPagoChange = event => {
    setCheckEstadoPago(event.target.checked);
  };

  const handleGuardar = () => {
    

    if (!selectedFechaCreacion) {
      setMensajeError(true);
      setMensaje('Debe seleccionar una fecha de creación.');
      setMostrarMensaje(true);
      return;
    }
    
    setGuardarHabilitado(false);
    
    const pedidosClientes = pedidos.filter(pedido => selectedClientes.includes(pedido.nombre_cliente));

    const formattedDate = selectedFechaCreacion.$d.toISOString();    
    
    
    const pedidosClientesFecha = pedidosClientes.filter(pedido => {
      const fechaCreacion = pedido.fecha;
      const fechaFiltro = formattedDate;

        

      return fechaCreacion < fechaFiltro;
    });
    

    const pedidosActualizados = pedidosClientesFecha.map(pedido => ({
      ...pedido,
      fecha_entrega: checkFechaEntrega ? (selectedFechaEntrega ? new Date(selectedFechaEntrega) : '') : pedido.fecha_entrega,
      localidad: checkLocalidad ? selectedLocalidad : pedido.localidad,
      estado_pedido: checkEstadoPedido ? selectedEstadoPedido : pedido.estado_pedido,
      estado_pago: checkEstadoPago ? selectedEstadoPago : pedido.estado_pago,
      usuario : localStorage.getItem('username')

    }));    
    
    pedidosActualizados.forEach(pedido => {
      axios.put(`https://vivosis-back-v2.vercel.app/api/pedido/${pedido._id}`, pedido)
        .then(response => {
          setMensaje('¡Pedido(s) actualizado(s) con éxito!');
          setMostrarMensaje(true);

        })
        .catch(error => {
          console.log('Error al actualizar el pedido:', error);
        });
    });
  };

  return (
    <>
    <br />
    <Box 
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh">
      <br />
      <Card sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography variant="h5" component='h4' gutterBottom sx={{ textAlign: 'center', mt: 3, mb: 3 }}>Actualizar pedidos (pendientes) de clientes</Typography>
          <Box display="flex" justifyContent="center" alignItems="center" >
            <Box width={800}>
              
                <Autocomplete
                  multiple
                  options={clientes}
                  value={selectedClientes}
                  onChange={handleClientesChange}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Clientes"
                      variant="outlined"
                      margin="dense"
                    />
                  )}
                />
                <br />                
                <Box display="flex" justifyContent="center" alignItems="center">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ m: 1, width: 250 }}
                      label="Fecha corte par actualizar"
                      value={selectedFechaCreacion}
                      onChange={handleFechaCreacionChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          margin="dense"
                          variant="outlined"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
                <Divider sx={{ my: 2 }} />           
                <div>
                  <FormControlLabel sx={{ m: 1, width: 250 }}
                    control={<Switch checked={checkFechaEntrega} onChange={handleCheckFechaEntregaChange} />}
                    label="Actualizar"
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker sx={{ m: 1, width: 250 }}
                      label="Fecha de entrega"
                      value={selectedFechaEntrega}
                      onChange={handleFechaEntregaChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="dense"
                          variant="outlined"
                          disabled={!checkFechaEntrega}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </div>
                <br/>
                <div>
                  <FormControlLabel sx={{ m: 1, width: 250 }}
                    control={<Switch checked={checkLocalidad} onChange={handleCheckLocalidadChange} />}
                    label="Localidad"
                  />
                  <Select sx={{ m: 1, width: 250 }}
                    autoWidth
                    label="Localidad"
                    width={200}
                    value={selectedLocalidad}
                    onChange={handleLocalidadChange}
                    variant="outlined"
                    margin="dense"
                    disabled={!checkLocalidad}
                  >
                    {localidades.map(localidad => (
                      <MenuItem key={localidad.value} value={localidad.value}>
                        {localidad.label}
                        
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <br />
                <div>
                  <FormControlLabel sx={{ m: 1, width: 250 }}
                    control={<Switch checked={checkEstadoPedido} onChange={handleCheckEstadoPedidoChange} />}
                    label="Estado del pedido"
                  />
                  <Select sx={{ m: 1, width: 250 }}
                    value={selectedEstadoPedido}
                    onChange={handleEstadoPedidoChange}
                    variant="outlined"
                    margin="dense"
                    disabled={!checkEstadoPedido}
                  >
                    {estadosPedido.map(estado => (
                      <MenuItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <br />
                <div>
                  <FormControlLabel sx={{ m: 1, width: 250 }}
                    control={<Switch checked={checkEstadoPago} onChange={handleCheckEstadoPagoChange} />}
                    label="Estado de pago"
                  />
                  <Select sx={{ m: 1, width: 250 }}
                    value={selectedEstadoPago}
                    onChange={handleEstadoPagoChange}
                    variant="outlined"
                    margin="dense"
                    disabled={!checkEstadoPago}
                  >
                    {estadosPago.map(estado => (
                      <MenuItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <br /><br /><br />
              
            </Box>
          </Box>
        </CardContent>
        
        <CardActions style={{ justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleGuardar} disabled={!guardarHabilitado}>
            Guardar
          </Button>
          
        </CardActions>
        </Box>
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
          severity={mensajeError ? "error" : "success"}
        >
          {mensaje}
        </MuiAlert>
      </Snackbar>
        </Box>
        </>
      );
      
    }
    
    export default ActualizaMasivaPedidos;