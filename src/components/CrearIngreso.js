import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';

function CrearIngreso() {
  const [fecha, setFecha] = useState('');
  const [idArticulo, setIdArticulo] = useState('');
  const [nombreArticulo, setNombreArticulo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [costoUnitario, setCostoUnitario] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [usuario, setUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [productos, setProductos] = useState([]);
  const [selectedFechaIngreso, setSelectedFechaIngreso] = useState(null);
  const [mensajeError, setMensajeError] = useState(false);

  useEffect(() => {
    fetch('http://vivosis.vercel.app:3001/api/producto/getallproductos')
      .then(response => response.json())
      .then(data => {
        setProductos(data);
      })
      .catch(error => {
        console.log('Error al obtener los productos:', error);
      });
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMostrarMensaje(false);
  };

  const handleFechaChange = newValue => {    
    setFecha(newValue.value); 
    alert(newValue.value);   
  };

  const handleIdArticuloChange = event => {
    setIdArticulo(event.target.value);
  };

  const handleNombreArticuloChange = (event, value) => {
    setNombreArticulo(value?.nombre || '');
    setIdArticulo(value?._id || '');
    setCostoUnitario(value?.costo || '');
    setPrecioVenta(value?.precio || '');
  };

  const handleCantidadChange = event => {
    const input = event.target.value;
    if (/^\d*$/.test(input)) {
      setCantidad(input);
    }
  };

  const handleMotivoChange = event => {
    setMotivo(event.target.value);
  };

  const handleCostoUnitarioChange = event => {
    const input = event.target.value;
    if (/^\d*(\.\d{0,2})?$/.test(input)) {
      setCostoUnitario(input);
    }
  };

  const handlePrecioVentaChange = event => {
    const input = event.target.value;
    if (/^\d*(\.\d{0,2})?$/.test(input)) {
      setPrecioVenta(input);
    }
  };

  const handleComentariosChange = event => {
    setComentarios(event.target.value);
  };

  const handleUsuarioChange = event => {
    setUsuario(event.target.value);
  };

  const calcularTotal = () => {
    const costoUnitarioFloat = parseFloat(costoUnitario);
    const cantidadFloat = parseFloat(cantidad);
    if (isNaN(costoUnitarioFloat) || isNaN(cantidadFloat)) {
      return '';
    }
    return (costoUnitarioFloat * cantidadFloat).toFixed(2);
  };

  const limpiarFormulario = () => {
    setFecha('');
    setIdArticulo('');
    setNombreArticulo('');
    setCantidad('');
    setMotivo('');
    setCostoUnitario('');
    setPrecioVenta('');
    setComentarios('');
    setUsuario('');
  };

  const handleFechaIngresoChange = newValue => {
    setSelectedFechaIngreso(newValue);
  };

  const handleGuardar = () => {
    if (
      idArticulo.trim() === '' ||
      cantidad === '' ||
      costoUnitario === '' ||
      precioVenta === ''
    ) {
      setMensaje('El Articulo, cantidad, costo y precio son obligatorios');
      setMensajeError(true);
      setMostrarMensaje(true);
      return;
    }
    const nuevoIngreso = {
      fecha_ingreso: selectedFechaIngreso ? selectedFechaIngreso.format('DD/MM/YYYY') : '',
      id_articulo: idArticulo,
      nombre_articulo: nombreArticulo,
      cantidad,
      costo_unitario: costoUnitario,      
      precio: precioVenta,
      total: cantidad * costoUnitario,      
      motivo,
      comentarios,
      usuario

    };
    fetch('http://vivosis.vercel.app:3001/api/ingreso/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoIngreso)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMensaje('¡Ingreso creado con éxito!');
        setMensajeError(false);
        setMostrarMensaje(true);
        limpiarFormulario();

        // Actualizar el producto con el costo, precio y fecha de último ingreso
        fetch(`http://vivosis.vercel.app:3001/api/producto/${idArticulo}`, {
          method: 'GET',
        })
          .then(response => response.json())
          .then(producto => {
            const fechaIngreso = selectedFechaIngreso ? selectedFechaIngreso.format('DD/MM/YYYY') : '';
            const costoUnitarioFloat = parseFloat(costoUnitario);
            const precioVentaFloat = parseFloat(precioVenta);

            // Actualizar los campos del producto
            producto.stock = producto.stock + parseInt(cantidad);
            producto.costo = costoUnitarioFloat;
            producto.precio = precioVentaFloat;
            producto.fecha_costo = fechaIngreso;

            // Enviar la solicitud para actualizar el producto
            fetch(`http://vivosis.vercel.app:3001/api/producto/${idArticulo}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(producto)
            })
              .then(response => response.json())
              .then(updatedProducto => {
                console.log('Producto actualizado:', updatedProducto);
              })
              .catch(error => {
                console.log('Error al actualizar el producto:', error);
              });
          })
          .catch(error => {
            console.log('Error al obtener el producto:', error);
          });
      })
      .catch(error => {
        console.log('Error al crear el ingreso:', error);
      });
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
          <h2>Crear Ingreso</h2>
          <form>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de ingreso"
                value={fecha}
                onChange={(newValue) => handleFechaIngresoChange(newValue)}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Fecha"
                    variant="outlined"
                    margin="dense"
                  />
                )}
                inputFormat="DD-MM-YYYY"
                renderDay={(day, _value, DayComponentProps) => (
                  <DayComponentProps.button {...DayComponentProps} />
                )}
              />
            </LocalizationProvider>
            <br />
            <TextField
              fullWidth
              label="ID Artículo"
              value={idArticulo}
              onChange={handleIdArticuloChange}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <Autocomplete
              fullWidth
              disableClearable
              options={productos}
              getOptionLabel={option => (option.nombre ? option.nombre.toLowerCase() : '')}
              value={nombreArticulo ? productos.find(p => p.nombre === nombreArticulo) : null}
              onChange={handleNombreArticuloChange}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Nombre Artículo"
                  variant="outlined"
                  margin="dense"
                />
              )}
            />
            <br />
            <TextField
              fullWidth
              label="Cantidad"
              value={cantidad}
              onChange={handleCantidadChange}
              variant="outlined"
              margin="dense"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
            />
            <br />
            <TextField
              fullWidth
              label="Costo Unitario"
              value={costoUnitario}
              onChange={handleCostoUnitarioChange}
              variant="outlined"
              margin="dense"
              inputProps={{
                inputMode: 'decimal',
                pattern: '[0-9]*'
              }}
            />
            <br />
            <TextField
              fullWidth
              label="Precio de venta"
              value={precioVenta}
              onChange={handlePrecioVentaChange}
              variant="outlined"
              margin="dense"
              inputProps={{
                inputMode: 'decimal',
                pattern: '[0-9]*'
              }}
            />
            <br />
            <TextField
              fullWidth
              label="Total"
              value={calcularTotal()}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <TextField
              fullWidth
              label="Motivo"
              value={motivo}
              onChange={handleMotivoChange}
              variant="outlined"
              margin="dense"
            />
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
            <TextField
              fullWidth
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
          <Box sx={{ mx: 0.25 }}>
            <Button variant="contained" color="secondary" onClick={limpiarFormulario} margin="dense">
              Limpiar
            </Button>
          </Box>
          <Box sx={{ mx: 1 }}>
            <Button variant="contained" color="error" component={Link} to="/veringresos">
              Cancelar
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
            severity={mensajeError ? 'error' : 'success'}
          >
            {mensaje}
          </MuiAlert>
        </Snackbar>
      </Card>
    </Box>
  );
}

export default CrearIngreso;
