import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import { listaEstados } from './api/cliente/cliente';

function ModificarProducto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [producto, setProducto] = useState({});
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');
  const [estado, setEstado] = useState('');

  const [categoriaDialog, setCategoriaDialog] = useState('');
  const [subcategoriaDialog, setSubcategoriaDialog] = useState('');
  const [categoriasDialog, setCategoriasDialog] = useState([]);
  const [subcategoriasDialog, setSubcategoriasDialog] = useState([]);

  const [precio, setPrecio] = useState(0);
  const [costo, setCosto] = useState(0);
  const [stock, setStock] = useState(0);
  const [comentarios, setComentarios] = useState('');
  const [usuario, setUsuario] = useState(localStorage.getItem('username'));
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [guardarHabilitado, setGuardarHabilitado] = useState(true);

  useEffect(() => {
    fetch(`https://vivosis-back-v2.vercel.app/api/producto/${id}`)
      .then(response => response.json())
      .then(data => {
        setProducto(data);
      })
      .catch(error => {
        console.log('Error al cargar el producto:', error);
      });
    fetch('https://vivosis-back-v2.vercel.app/api/categoria/getallcategorias')
      .then(response => response.json())
      .then(data => {
        setCategoriasDialog(data);
      })
      .catch(error => {
        console.log('Error al obtener las categorías:', error);
      });
  }, [id]);

  useEffect(() => {
    setNombre(producto.nombre || '');
    setCategoria(producto.categoria || '');
    setSubcategoria(producto.subcategoria || '');
    setPrecio(producto.precio || 0);
    setCosto(producto.costo || 0);
    setStock(producto.stock || 0);
    setEstado(producto.estado || '');
    setComentarios(producto.comentarios || '');
    
  }, [producto]);

  const handleNombreChange = event => {
    setNombre(event.target.value);
  };

  const handleCategoriaChange = event => {
    setCategoria(event.target.value);
  };

  const handleSubcategoriaChange = event => {
    setSubcategoria(event.target.value);
    setSubcategoriaDialog(event.target.value);
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



  const handleGuardar = () => {
    setGuardarHabilitado(false);
    const productoModificado = {
      ...producto,
      nombre,
      categoria,
      subcategoria,
      costo,
      precio,      
      stock,
      estado,
      comentarios
      
    };
    fetch(`https://vivosis-back-v2.vercel.app/api/producto/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productoModificado)
    })
      .then(response => response.json())
      .then(data => {
        setMensaje('El producto ha sido actualizado');
        setMostrarMensaje(true);
        setTimeout(() => {
          navigate(`/verproductos`);
        }, 800);
      })
      .catch(error => {
        console.log('Error al modificar el producto:', error);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMostrarMensaje(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialogCancel = () => {
    setOpenDialog(false);
  };
  const handleEstadoChange = (event) => {
    setEstado(event.target.value);
  };
  
  const handleCloseDialogSave = () => {
    setOpenDialog(false);
    const selectedCategoriaObj = categoriasDialog.find(c => c._id === categoriaDialog);
    if (selectedCategoriaObj) {      
      setCategoria(selectedCategoriaObj.nombre);
      setSubcategoria(selectedCategoriaObj.subcategorias.find(s => s._id === subcategoriaDialog).nombre);
      //setSubcategoria(selectedCategoriaObj.subcategorias);
    }
    
    
    //setCategoria(categoriaDialog);
    //setSubcategoria(subcategoriaDialog);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCategoriaDialogChange = event => {
    const selectedCategoria = event.target.value;
    setCategoriaDialog(selectedCategoria);
    const selectedCategoriaObj = categoriasDialog.find(c => c._id === selectedCategoria);
    if (selectedCategoriaObj) {
      setSubcategoriasDialog(selectedCategoriaObj.subcategorias);
    }
  };

  const handleSubcategoriaDialogChange = event => {
    setSubcategoriaDialog(event.target.value);
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
          <h2>Modificar Producto</h2>
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
              onClick={handleOpenDialog}
            />
            <br />
            <TextField
              fullWidth
              label="Subcategoría"
              value={subcategoria}
              onChange={handleSubcategoriaChange}
              variant="outlined"
              margin="dense"
              onClick={handleOpenDialog}
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
              label="Stock"
              type="number"
              value={stock}
              onChange={handleStockChange}
              variant="outlined"
              margin="dense"
            />
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
        <CardActions style={{ justifyContent: 'center' }}>
          <Box sx={{ mx: 1 }}>
            <Button variant="contained" color="primary" onClick={handleGuardar}>
              Guardar
            </Button>
          </Box>
          <Box sx={{ mx: 1 }}>
            <Button variant="contained" color='error' component={Link} to="/verproductos">
              Atrás
            </Button>
          </Box>
        </CardActions>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Seleccionar categoría y subcategoría</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Categoría"
            value={categoriaDialog}
            onChange={handleCategoriaDialogChange}
            variant="outlined"
            margin="dense"
          >
            {categoriasDialog.map(categoria => (
              <MenuItem key={categoria._id} value={categoria._id}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </TextField>
          <br />
          <TextField
            fullWidth
            select
            label="Subcategoría"
            value={subcategoriaDialog}
            onChange={handleSubcategoriaDialogChange}
            variant="outlined"
            margin="dense"
          >
            {subcategoriasDialog.map(subcategoria => (
              <MenuItem key={subcategoria._id} value={subcategoria._id}>
                {subcategoria.nombre}
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
        autoHideDuration={6000}
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

export default ModificarProducto;
