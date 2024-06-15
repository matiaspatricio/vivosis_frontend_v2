import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { listaEstados } from './api/cliente/cliente';
import { getCategorias } from './api/categoria/categoria';
import { getSubcategoriasByIdCategoria } from './api/subcategoria/subcategoria';


function CrearProducto() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [costo, setCosto] = useState('');
  const [stock, setStock] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [usuario, setUsuario] = useState(localStorage.getItem('username'));
  const [mensaje, setMensaje] = useState('');
  
  
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mensajeError, setMensajeError] = useState(false);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [listaSubcategorias, setListaSubcategorias] = useState([]);

  useEffect(() => {    
      
      //fetchSubcategorias();      
      fetchCategorias();  


  }, []);

  const fetchCategorias = async () => {
    const listaCategorias = await getCategorias();
    setListaCategorias(listaCategorias);
  };
  const fetchSubcategorias = async (categoriaId) => {
    const listaSubcategorias = await getSubcategoriasByIdCategoria(categoriaId);
    console.log(listaSubcategorias)
    setListaSubcategorias(listaSubcategorias);
  };

  const handleNombreChange = event => {
    setNombre(event.target.value);
  };

  const handleCategoriaChange = event => {
    const selectedCategoria = event.target.value;
    setCategoria(selectedCategoria);
    console.log('selectedCategoria:', selectedCategoria)
    fetchSubcategorias(selectedCategoria);
    

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



  const limpiarFormulario = () => {
    setNombre('');
    setCategoria('');
    setSubcategoria('');
    setPrecio('');
    setCosto('');
    setStock('');
    setComentarios('');
    
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

      // Obtener los nombres de la categoría y subcategoría seleccionadas
      const categoriaSeleccionada = listaCategorias.find(c => c._id === categoria);
      const subcategoriaSeleccionada = listaSubcategorias.find(s => s._id === subcategoria);
      const nombreCategoria = categoriaSeleccionada ? categoriaSeleccionada.nombre : '';
      const nombreSubcategoria = subcategoriaSeleccionada ? subcategoriaSeleccionada.nombre : '';

      const nuevoProducto = {
        nombre,
        categoria: categoria,
        subcategoria: subcategoria,
        costo,
        precio,        
        stock,
        comentarios        
};
  console.log('nuevoProducto:', nuevoProducto)
  
    fetch('https://vivosis-back-v2.vercel.app/api/producto/', {
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
        setTimeout(() => {
          navigate(`/verproductos`);
        }, 800);
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

            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel id="categoria-label" >Categoria</InputLabel>
              <Select
                labelId="categoria-label"
                value={categoria}
                onChange={handleCategoriaChange}
                label="Categoria"
              >
                {listaCategorias && listaCategorias.map(categoria => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </Select>

            </FormControl>
            <br />    

            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel id="subcategoria-label" >Subcategoria</InputLabel>
              <Select
                labelId="subcategoria-label"
                value={subcategoria}
                onChange={handleSubcategoriaChange}
                label="Subcategoria"
              >
                {listaSubcategorias && listaSubcategorias.map(subcategoria => (
                  <MenuItem key={subcategoria.id} value={subcategoria.id}>
                    {subcategoria.nombre}
                  </MenuItem>
                ))}
              </Select>

            </FormControl>
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
              label="Precio"
              value={precio}
              onChange={handlePrecioChange}
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
              rows={4}
              multiline
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
