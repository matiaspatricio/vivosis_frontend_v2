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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';

function ModificarProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState({});
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState('');

  const [categoriaDialog, setCategoriaDialog] = useState('');
  const [subcategoriaDialog, setSubcategoriaDialog] = useState('');
  const [categoriasDialog, setCategoriasDialog] = useState([]);
  const [subcategoriasDialog, setSubcategoriasDialog] = useState([]);

  const [precio, setPrecio] = useState(0);
  const [costo, setCosto] = useState(0);
  const [stock, setStock] = useState(0);
  const [comentarios, setComentarios] = useState('');
  const [usuario, setUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [guardarHabilitado, setGuardarHabilitado] = useState(true);

  useEffect(() => {
    fetch(`https://vivosis.vercel.app/api/producto/${id}`)
      .then(response => response.json())
      .then(data => {
        setProducto(data);
      })
      .catch(error => {
        console.log('Error al cargar el producto:', error);
      });
    fetch('https://vivosis.vercel.app/api/categoria/getallcategorias')
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
    setComentarios(producto.comentarios || '');
    setUsuario(producto.usuario || '');
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

  const handleUsuarioChange = event => {
    setUsuario(event.target.value);
  };

  const handleGuardar = () => {
    setGuardarHabilitado(false);
    const productoModificado = {
      ...producto,
      nombre,
      categoria,
      subcategoria,
      precio,
      costo,
      stock,
      comentarios,
      usuario
    };
    fetch(`https://vivosis.vercel.app/api/producto/${id}`, {
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
              label="Nombre"
              value={nombre}
              onChange={handleNombreChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              label="Categoría"
              value={categoria}
              onChange={handleCategoriaChange}
              variant="outlined"
              margin="dense"
              onClick={handleOpenDialog}
            />
            <br />
            <TextField
              label="Subcategoría"
              value={subcategoria}
              onChange={handleSubcategoriaChange}
              variant="outlined"
              margin="dense"
              onClick={handleOpenDialog}
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
              label="Costo"
              type="number"
              value={costo}
              onChange={handleCostoChange}
              variant="outlined"
              margin="dense"
            />
            <br />
            <TextField
              label="Stock"
              type="number"
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
            <TextField
              fullWidth
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
            <Button variant="contained" color="primary" onClick={handleGuardar}>
              Guardar
            </Button>
          </Box>
          <Box sx={{ mx: 1 }}>
            <Button variant="contained" component={Link} to="/verproductos">
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
