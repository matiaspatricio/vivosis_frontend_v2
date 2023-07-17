
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
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Typography } from '@mui/material';
import { Box, Grid } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { utcToZonedTime, format } from 'date-fns-tz';
import { format as formatDate } from 'date-fns';



const useStyles = makeStyles({
  root: {
    height: 400,
    width: '100%',
    margin: '10px auto',
    '& .MuiDataGrid-root': {
      border: '1px solid #ccc',
      backgroundColor: '#ffffff',
    },
    '& .MuiDataGrid-cell': {
      border: '1px solid #ccc',
      padding: '8px',
    },
    '& .MuiButton-root': {
      marginLeft: '5px',
    },
  },
  filtersContainer: {
    margin: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  filterInput: {
    width: '180px',
  },
});

function VerPedidos() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filterEstadoPedido, setFilterEstadoPedido] = useState([]);
  const [filterEstadoPago, setFilterEstadoPago] = useState([]);
  const [filterNombreClienteValue, setFilterNombreClienteValue] = useState([]);
  const [filterNombreClienteOptions, setFilterNombreClienteOptions] = useState([]);
  const [filterNombreArticuloValue, setFilterNombreArticuloValue] = useState([]);
  const [filterNombreArticuloOptions, setFilterNombreArticuloOptions] = useState([]);

  useEffect(() => {
    fetch('https://vivosis.vercel.app/api/pedido/getallpedidos')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const pedidosConId = data.map(pedido => ({
          id: pedido._id,
          ...pedido,
          fecha_entrega:  pedido.fecha_entrega ? formatFecha(pedido.fecha_entrega): null,
          fecha: formatFecha(pedido.fecha),
        }));
        console.log(pedidosConId)
        setPedidos(pedidosConId);
        setLoading(false);
      })
      .catch(error => {
        console.log('Error al cargar los pedidos:', error);
        setLoading(false);
      });
  }, [refreshCount]);

  const formatFecha = fecha => {
    const fechaUtc = new Date(fecha);
    const formattedFecha = utcToZonedTime(fechaUtc, 'America/Argentina/Buenos_Aires');
    const fechaFormateada = formatDate(formattedFecha, 'dd/MM/yyyy HH:mm:ss');
    //const fechaFormateada = formattedFecha
    return fechaFormateada;
  };

  useEffect(() => {
    const nombreClienteOptions = Array.from(new Set(pedidos.map(pedido => pedido.nombre_cliente)));
    setFilterNombreClienteOptions(nombreClienteOptions);
  }, [pedidos]);

  useEffect(() => {
    const nombreArticuloOptions = Array.from(new Set(pedidos.map(pedido => pedido.nombre_articulo)));
    setFilterNombreArticuloOptions(nombreArticuloOptions);
  }, [pedidos]);

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
    fetch(`https://vivosis.vercel.app/api/producto/${productId}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(producto => {
        producto.stock += quantity;

        fetch(`https://vivosis.vercel.app/api/producto/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(producto),
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
    console.log('PedidoAEliminar: ', pedidoAEliminar);
    actualizarStockProducto(pedidoAEliminar.id_articulo, pedidoAEliminar.cantidad);
    fetch(`https://vivosis.vercel.app/api/pedido/${selectedPedido}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        setRefreshCount(prevCount => prevCount + 1);
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.log('Error al eliminar el pedido:', error);
      });
  };

  const handleSearch = event => {
    setSearchText(event.target.value);
  };

  const handleFilterEstadoPedidoChange = (event, value) => {
    setFilterEstadoPedido(value);
  };

  const handleFilterEstadoPagoChange = (event, value) => {
    setFilterEstadoPago(value);
  };

  const handleFilterNombreClienteChange = (event, value) => {
    setFilterNombreClienteValue(value);
  };

  const handleFilterNombreArticuloChange = (event, value) => {
    setFilterNombreArticuloValue(value);
  };

  const filteredPedidos = pedidos.filter(pedido =>
    pedido && pedido.nombre_cliente && pedido.nombre_cliente.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredPedidosByEstadoPedido = filterEstadoPedido.length > 0
    ? filteredPedidos.filter(pedido => filterEstadoPedido.includes(pedido.estado_pedido))
    : filteredPedidos;

  const filteredPedidosByEstadoPago = filterEstadoPago.length > 0
    ? filteredPedidosByEstadoPedido.filter(pedido => filterEstadoPago.includes(pedido.estado_pago))
    : filteredPedidosByEstadoPedido;

  const filteredPedidosByNombreCliente = filterNombreClienteValue.length > 0
    ? filteredPedidosByEstadoPago.filter(pedido => filterNombreClienteValue.includes(pedido.nombre_cliente))
    : filteredPedidosByEstadoPago;

  const filteredPedidosByNombreArticulo = filterNombreArticuloValue.length > 0
    ? filteredPedidosByNombreCliente.filter(pedido => filterNombreArticuloValue.includes(pedido.nombre_articulo))
    : filteredPedidosByNombreCliente;

  const columns = [
    { field: '_id', headerName: 'Id', flex: 0.5 },
    { field: 'fecha', headerName: 'Fecha', flex: 2.5 },
    { field: 'nombre_cliente', headerName: 'Cliente', flex: 0.5 },
    { field: 'localidad', headerName: 'Localidad', flex: 0.5 },
    { field: 'nombre_articulo', headerName: 'Artículo', flex: 0.7 },
    { field: 'cantidad', headerName: 'Cantidad', flex: 0.3 },
    { field: 'precio', headerName: 'Precio', flex: 0.2 },
    { field: 'total', headerName: 'Total', flex: 0.2 },
    { field: 'costo', headerName: 'Costo', flex: 0.2 },
    { field: 'estado_pedido', headerName: 'Estado Pedido', flex: 0.4 },
    { field: 'estado_pago', headerName: 'Estado Pago', flex: 0.4 },
    { field: 'fecha_entrega', headerName: 'Fecha de entrega', flex: 0.5 },
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
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="Eliminar"
            onClick={() => handleDelete(params.row.id)}
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

  const estadosPedido = ['PENDIENTE', 'PREPARADO', 'FINALIZADO', 'CANCELADO'];
  const estadosPago = ['PENDIENTE', 'ABONADO'];

  return (
    <div className={classes.root}>
      {loading ? (
        <Box>Cargando pedidos...</Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleCrearPedido} size="large" endIcon={<CreateIcon />} >
              Crear Pedido
            </Button>
          </Box>
          <Grid container className={classes.filtersContainer}>
            <Grid item xs={6}>
              <Autocomplete className={classes.filtersContainer}
                multiple
                options={estadosPedido}
                value={filterEstadoPedido}
                onChange={handleFilterEstadoPedidoChange}
                renderInput={params => (
                  <TextField {...params} label="Estado Pedido" variant="outlined" className={classes.filterInput} />
                )}
              />
            </Grid>            
            <Grid item xs={6}>
              <Autocomplete className={classes.filtersContainer}
                multiple
                options={filterNombreClienteOptions}
                value={filterNombreClienteValue}
                onChange={handleFilterNombreClienteChange}
                renderInput={params => (
                  <TextField {...params} label="Nombre Cliente" variant="outlined" className={classes.filterInput} />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete className={classes.filtersContainer}
                multiple
                options={estadosPago}
                value={filterEstadoPago}
                onChange={handleFilterEstadoPagoChange}
                renderInput={params => (
                  <TextField {...params} label="Estado Pago" variant="outlined" className={classes.filterInput} />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete className={classes.filtersContainer}
                fullWidth
                multiple
                options={filterNombreArticuloOptions}
                value={filterNombreArticuloValue}
                onChange={handleFilterNombreArticuloChange}
                renderInput={params => (
                  <TextField {...params} label="Nombre Artículo" variant="outlined" className={classes.filterInput} />
                )}
              />
            </Grid>
            <Grid item xs={12} className={classes.filtersContainer}>
              
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
                className={classes.filterInput}
              />
            </Grid>
          </Grid>
          <DataGrid 
            rows={filteredPedidosByNombreArticulo}
            columns={columns}
            components={{
              Toolbar: GridToolbar,
            }}
            disableRowSelectionOnClick
            density="compact"
          />

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