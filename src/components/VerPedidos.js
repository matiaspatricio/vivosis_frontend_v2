import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Button from '@material-ui/core/Button';
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
import { Typography } from '@mui/material';

const useStyles = makeStyles({
  root: {
    height: 400,
    width: '100%',
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

function VerPedidos() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshCount, setRefreshCount] = useState(0); // Nuevo estado para contar las actualizaciones
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  

  useEffect(() => {
    fetch('http://192.168.0.10:3001/api/pedido/getallpedidos')
      .then(response => response.json())
      .then(data => {
        const pedidosConId = data.map(pedido => ({
          id: pedido._id,
          ...pedido,
          fecha_entrega: pedido.fecha_entrega, // Formatear la fecha
        }));
        setPedidos(pedidosConId);
        setLoading(false);
      })
      .catch(error => {
        console.log('Error al cargar los pedidos:', error);
        setLoading(false);
      });
  }, [refreshCount]);

  const handleEdit = id => {
    console.log(id);
    navigate(`/ModificarPedido/${id}`);
  };
  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const actualizarStockProducto = (productId, quantity) => {
    fetch(`http://192.168.0.10:3001/api/producto/${productId}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(producto => {
        producto.stock += quantity;

        fetch(`http://192.168.0.10:3001/api/producto/${productId}`, {
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

  const confirmDelete = () => {
    setConfirmDialogOpen(false);
    const pedidoAEliminar = pedidos.find(pedido => pedido.id === selectedPedido);
    console.log("PedidoAEliminar: ", pedidoAEliminar);
    actualizarStockProducto(pedidoAEliminar.id_articulo, pedidoAEliminar.cantidad); // Actualizar el stock del producto
    fetch(`http://192.168.0.10:3001/api/pedido/${selectedPedido}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        setRefreshCount(prevCount => prevCount + 1); // Incrementar el contador para forzar la actualización de la grilla
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.log('Error al eliminar el pedido:', error);
      });
  };

  const handleSearch = event => {
    setSearchText(event.target.value);
  };

  const formatDate = date => {
    const formattedDate = new Date(date).toLocaleDateString('es-AR'); // Formatear la fecha a "DD/MM/YYYY"
    return formattedDate;
  };

  const filteredPedidos = pedidos.filter(pedido =>
    pedido && pedido.nombre_cliente && pedido.nombre_cliente.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { field: 'fecha', headerName: 'Fecha', flex: 0.5 },
    //{ field: 'id_cliente', headerName: 'ID Cliente', flex: 1 },
    { field: 'nombre_cliente', headerName: 'Cliente', flex: 0.5 },
    //{ field: 'id_articulo', headerName: 'ID Artículo', flex: 1 },
    { field: 'localidad', headerName: 'Localidad', flex: 0.5 },
    { field: 'nombre_articulo', headerName: 'Artículo', flex: 0.7 },
    { field: 'cantidad', headerName: 'Cantidad', flex: 0.3 },
    { field: 'precio', headerName: 'Precio', flex: 0.2 },
    { field: 'total', headerName: 'Total', flex: 0.2 },
    { field: 'costo', headerName: 'Costo', flex: 0.2 },
    { field: 'estado_pedido', headerName: 'Estado Pedido', flex: 0.4 },
    { field: 'estado_pago', headerName: 'Estado Pago', flex: 0.4 },
    { field: 'fecha_entrega', headerName: 'Fecha de entrega', flex: 0.5 }, // Nuevo campo "Fecha de entrega"
    { field: 'comentarios', headerName: 'Comentarios', flex: 1 },
    { field: 'usuario', headerName: 'Usuario', flex: 0.5 },
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

  const handleDelete = id => {
    setSelectedPedido(id);
    setConfirmDialogOpen(true);
  };
  const handleCrearPedido = () => {
    navigate('/CrearPedido');
  };

  return (
    <div className={classes.root}>

      <Typography variant='h4' align='center' >PEDIDOS</Typography>
      {loading ? (
        <div>Cargando pedidos...</div>
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
            rows={filteredPedidos}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
          <div className={classes['center-button']}>
            <Button variant="contained" color="primary" onClick={handleCrearPedido}>
              Crear Pedido
            </Button>
          </div>
          <Dialog open={confirmDialogOpen} onClose={handleCancelDelete}>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Estás seguro de que deseas eliminar este pedido?
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
              Pedido eliminado correctamente.
            </MuiAlert>
          </Snackbar>
        </>
      )}
    </div>
  );
}

export default VerPedidos;
