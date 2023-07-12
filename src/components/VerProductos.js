import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const useStyles = makeStyles({
  root: {
    height: 400,
    width: '70%',
    margin: '0 auto',
    '& .MuiDataGrid-root': {
      backgroundColor: '#f5f5f5',
    },
    '& .MuiDataGrid-cell': {
      border: '1px solid #ccc',
      padding: '8px',
    },
    '& .MuiButton-root': {
      marginLeft: '5px',
    },
  },
});

function VerProductos() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshCount, setRefreshCount] = useState(0); // Nuevo estado para contar las actualizaciones
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetch('https://vivosis.vercel.app/api/producto/getallproductos')
      .then(response => response.json())
      .then(data => {
        const productosConId = data.map(producto => ({
          id: producto._id,
          ...producto
        }));
        setProductos(productosConId);
        setLoading(false);
      })
      .catch(error => {
        console.log('Error al cargar los productos:', error);
        setLoading(false);
      });
  }, [refreshCount]);

  const handleEdit = id => {
    // Redirigir a la página de edición del producto con el id proporcionado
    console.log(id);
    navigate(`/ModificarProducto/${id}`);
  };

  const confirmDelete = id => {
    setConfirmDialogOpen(false);
    fetch(`https://vivosis.vercel.app/api/producto/${selectedProduct}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        
        setRefreshCount(prevCount => prevCount + 1); // Incrementar el contador para forzar la actualización de la grilla
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.log('Error al eliminar el producto:', error);
      });
  };

  const handleDelete = id => {
    setSelectedProduct(id);
    setConfirmDialogOpen(true);
  };


  const handleSearch = event => {
    setSearchText(event.target.value);
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };

  const filteredProductos = productos.filter(producto =>
    producto && producto.nombre && producto.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'categoria', headerName: 'Categoría', flex: 1 },
    { field: 'subcategoria', headerName: 'Subcategoría', flex: 1 },
    { field: 'precio', headerName: 'Precio', flex: 1 },
    { field: 'costo', headerName: 'Costo', flex: 1 },
    { field: 'stock', headerName: 'Stock', flex: 1 },
    { field: 'comentarios', headerName: 'Comentarios', flex: 1 },
    { field: 'usuario', headerName: 'Usuario', flex: 1 },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 0.5,
      renderCell: params => (
        <>
          <IconButton
            aria-label="Editar"
            onClick={() => handleEdit(params.row._id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="Eliminar"
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  const handleCrearProducto = () => {
    navigate('/CrearProducto');
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  

  return (
    <div className={classes.root}>
      {loading ? (
        <div>Cargando productos...</div>
      ) : (
        <>
          <br/><br/><br/><br/><br/><br/>
          <TextField
            label="Buscar"
            variant="outlined"
            value={searchText}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <DataGrid
            rows={filteredProductos}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
              <div className={classes['center-button']}>
            <Button variant="contained" color="primary" onClick={handleCrearProducto}>
              Crear Producto
            </Button>
          </div>
          <Dialog open={confirmDialogOpen} onClose={handleCancelDelete}>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Estás seguro de que deseas eliminar este producto?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancelar
              </Button>
              <Button onClick={confirmDelete} color="primary" autoFocus>
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
            <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
              Producto eliminado correctamente.
            </MuiAlert>
          </Snackbar>
        </>
      )}
    </div>
  );
}

export default VerProductos;
