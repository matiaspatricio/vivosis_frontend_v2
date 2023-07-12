import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function CrearProducto() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [costo, setCosto] = useState('');
  const [stock, setStock] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [usuario, setUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mensajeError, setMensajeError] = useState(false);

  useEffect(() => {
    fetch('https://vivosis.vercel.app:3001/api/categoria/getAllCategorias')
      .then(response => response.json())
      .then(data => {
        setCategorias(data);
      })
      .catch(error => {
        console.log('Error al obtener las categorías:', error);
      });
  }, []);

  const handleNombreChange = event => {
    setNombre(event.target.value);
  };

  const handleCategoriaChange = event => {
    const selectedCategoria = event.target.value;
    setCategoria(selectedCategoria);

    const selectedCategoriaObj = categorias.find(c => c._id === selectedCategoria);
    if (selectedCategoriaObj) {
      setSubcategorias(selectedCategoriaObj.subcategorias);
    }
  };

  const handleSubcategoriaChange = event => {
    setSubcategoria(event.target.value);
  };

  const handlePrecioChange = event => {
    setPrecio(event.target.value);
  };

  const handleCostoChange = event => {
    setCosto(event.target.value);
  };

  const handleStockChange = event => {
    setStock(event.target.value);
  };

  const handleComentariosChange = event => {
    setComentarios(event.target.value);
  };

  const handleUsuarioChange = event => {
    setUsuario(event.target.value);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setCategoria('');
    setSubcategoria('');
    setPrecio('');
    setCosto('');
    setStock('');
    setComentarios('');
    setUsuario('');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMostrarMensaje(false);
    setMensajeError(false);
  };

  const handleGuardar = () => {
    // Verificar si el nombre, la categoría y la subcategoría están presentes
    if (!nombre.trim() || !categoria || !subcategoria) {
      setMensaje('Complete al menos el nombre, la categoría y la subcategoría');
      setMensajeError(true);
      setMostrarMensaje(true);
      return;
    }

    const nuevoProducto = {
      nombre,
      categoria,
      subcategoria,
      precio,
      costo,
      stock,
      comentarios,
      usuario
    };

    fetch('https://vivosis.vercel.app:3001/api/producto/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoProducto)
    })
      .then(response => response.json())
      .then(data => {
        setMensaje('¡Producto creado con éxito!');
        setMensajeError(false);
        setMostrarMensaje(true);
        limpiarFormulario();
      })
      .catch(error => {
        console.log('Error al crear el producto:', error);
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
          <h2>Crear Producto</h2>
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
              label="Categoría"
              value={categoria}
              onChange={handleCategoriaChange}
              variant="outlined"
              margin="dense"
              select
            >
              {categorias.map(c => (
                <MenuItem key={c._id} value={c._id}>
                  {c.nombre}
                </MenuItem>
              ))}
            </TextField>
            <br />
            <TextField
              fullWidth
              label="Subcategoría"
              value={subcategoria}
              onChange={handleSubcategoriaChange}
              variant="outlined"
              margin="dense"
              select
            >
              {subcategorias.map(s => (
                <MenuItem key={s._id} value={s._id}>
                  {s.nombre}
                </MenuItem>
              ))}
            </TextField>
            <br />
            <TextField
              fullWidth
              label="Precio"
              value={precio}
              onChange={handlePrecioChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              fullWidth
              label="Costo"
              value={costo}
              onChange={handleCostoChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              fullWidth
              label="Stock"
              value={stock}
              onChange={handleStockChange}
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
            <Link to="/verproductos">
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

export default CrearProducto;
