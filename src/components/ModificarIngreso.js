import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

function ModificarIngreso() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ingreso, setIngreso] = useState({});
  const [fecha, setFecha] = useState('');
  const [nombreArticulo, setNombreArticulo] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [cantidadOriginal, setCantidadOriginal] = useState(0);
  const [motivo, setMotivo] = useState('');
  const [costoUnitario, setCostoUnitario] = useState(0);
  const [precioVenta, setPrecioVenta] = useState(0);
  const [comentarios, setComentarios] = useState('');
  const [usuario, setUsuario] = useState(localStorage.getItem('username'));
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [idArticulo, setIdArticulo] = useState('');
  const [productos, setProductos] = useState([]);
  const [guardarHabilitado, setGuardarHabilitado] = useState(true);

  useEffect(() => {
    fetch(`https://vivosis-back-v2.vercel.app/api/ingreso/${id}`)
      .then(response => response.json())
      .then(data => {
        setIngreso(data);
      })
      .catch(error => {
        console.log('Error al cargar el ingreso:', error);
      });
  }, [id]);

  useEffect(() => {
    setIdArticulo(ingreso.id_articulo || '');
    setFecha(ingreso.fecha_ingreso || '');
    setNombreArticulo(ingreso.nombre_articulo || '');
    setCantidad(ingreso.cantidad || 0);
    setCantidadOriginal(ingreso.cantidad || 0);
    setMotivo(ingreso.motivo || '');
    setCostoUnitario(ingreso.costo_unitario || 0);
    setPrecioVenta(ingreso.precio || 0);
    setComentarios(ingreso.comentarios || '');    
  }, [ingreso]);

  useEffect(() => {
    fetch('https://vivosis-back-v2.vercel.app/api/producto/getallproductos')
      .then(response => response.json())
      .then(data => {
        setProductos(data);
      })
      .catch(error => {
        console.log('Error al obtener los productos:', error);
      });
  }, []);

  const calcularTotal = () => {
    const costoUnitarioFloat = parseFloat(costoUnitario);
    const cantidadFloat = parseFloat(cantidad);
    if (isNaN(costoUnitarioFloat) || isNaN(cantidadFloat)) {
      return '';
    }
    return (costoUnitarioFloat * cantidadFloat).toFixed(2);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMostrarMensaje(false);
  };

  const handleFechaChange = event => {
    setFecha(event.target.value);
  };

  const handleNombreArticuloChange = event => {
    setNombreArticulo(event.target.value);
  };

  const handleCantidadChange = event => {
    const inputCantidad = event.target.value;
    setCantidad(inputCantidad);
  };

  const handleMotivoChange = event => {
    setMotivo(event.target.value);
  };

  const handleCostoUnitarioChange = event => {
    setCostoUnitario(event.target.value);
  };

  const handlePrecioVentaChange = event => {
    setPrecioVenta(event.target.value);
  };

  const handleComentariosChange = event => {
    setComentarios(event.target.value);
  };


  const handleGuardar = () => {
    setGuardarHabilitado(false);

    const diferenciaCantidad = cantidad - cantidadOriginal;

    const ingresoModificado = {
      ...ingreso,
      fecha,
      nombre_articulo: nombreArticulo,
      cantidad,
      motivo,
      costo_unitario: costoUnitario,
      precio_venta: precioVenta,
      comentarios,
      usuario,
      stock: cantidad,
    };

    fetch(`https://vivosis-back-v2.vercel.app/api/ingreso/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingresoModificado),
    })
      .then(response => response.json())
      .then(data => {
        setMensaje('El ingreso ha sido actualizado');
        setMostrarMensaje(true);

        fetch(`https://vivosis-back-v2.vercel.app/api/producto/${idArticulo}`, {
          method: 'GET',
        })
          .then(response => response.json())
          .then(producto => {
            const fechaIngreso = fecha ? fecha : '';
            const costoUnitarioFloat = parseFloat(costoUnitario);
            const precioVentaFloat = parseFloat(precioVenta);
            
            producto.stock = producto.stock + diferenciaCantidad;
            producto.costo = costoUnitarioFloat;
            producto.precio = precioVentaFloat;
            producto.fecha_costo = fechaIngreso;

            fetch(`https://vivosis-back-v2.vercel.app/api/producto/${idArticulo}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(producto)
            })
              .then(response => response.json())
              .then(updatedProducto => {
                console.log('Producto actualizado:', updatedProducto);                                
                setTimeout(() => {
                  navigate(`/veringresos`);
                }, 800);

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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card>
        <CardContent>
          <h2>Modificar Ingreso</h2>
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
              fullWidth
              label="ID Artículo"
              value={idArticulo}
              variant="outlined"
              margin="dense"
              disabled
            />
            <br />
            <TextField
              label="Nombre del Artículo"
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
              disabled={!guardarHabilitado} // Nuevo atributo disabled
            />
            <br />
            <TextField
              label="Costo Unitario"
              type="number"
              value={costoUnitario}
              onChange={handleCostoUnitarioChange}
              variant="outlined"
              margin="dense"
              disabled={!guardarHabilitado} // Nuevo atributo disabled
            />
            <br />
            <TextField
              label="Precio de Venta"
              type="number"
              value={precioVenta}
              onChange={handlePrecioVentaChange}
              variant="outlined"
              margin="dense"
              disabled={!guardarHabilitado} // Nuevo atributo disabled
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
              label="Motivo"
              value={motivo}
              onChange={handleMotivoChange}
              variant="outlined"
              margin="dense"
              disabled={!guardarHabilitado} // Nuevo atributo disabled
            />
            <br />
            <TextField
              label="Comentarios"
              value={comentarios}
              onChange={handleComentariosChange}
              variant="outlined"
              margin="dense"
              disabled={!guardarHabilitado} // Nuevo atributo disabled
            />
            <br />
            
          </form>
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <Box sx={{ mx: 1 }}>
            <Button variant="contained" color="primary" onClick={handleGuardar} disabled={!guardarHabilitado}> {/* Nuevo atributo disabled */}
              Guardar
            </Button>
          </Box>
          <Box sx={{ mx: 1 }}>
            <Button variant="contained" color='error' component={Link} to="/veringresos">
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

export default ModificarIngreso;
