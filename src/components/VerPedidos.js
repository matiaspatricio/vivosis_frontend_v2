
import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
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
import { Typography,Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Box, Grid, Card} from '@mui/material';
import { utcToZonedTime } from 'date-fns-tz';
import { format as formatDate, set } from 'date-fns';
import { actualizarPedido, getPedidosPendientes } from './api/pedido/pedido';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Checkbox from '@mui/material/Checkbox';





const useStyles = makeStyles({
  card: {
    maxWidth: '90%',
    justifyContent: 'center',
    margin: '0 auto',    
    backgroundColor : '#f9fafb',    
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,   
    fontFamily: 'Public Sans, sans-serif',
    margin: '15px',         
  },
  button: {
    margin: '15px',},
  root: {
    height: 400,
    width: '100%',
    margin: '10px auto',
    '& .MuiDataGrid-root': {
      border: '0px solid #ccc',//tenia border 1
      backgroundColor: '#ffffff',
    },
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: '#f4f6f8', // Cambia este valor al color deseado
      color: '#6f7f8b', // Cambia este valor al color deseado para el texto del encabezado
    },

    '& .MuiDataGrid-cell': {
      border: '0.1px solid #ccc',
      padding: '8px',
      
    },
    '& .MuiButton-root': {
      marginLeft: '5px',
    },
  },
  filtersContainer: {    
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    marginBottom: '30px',        
  },
  filterInput: {
    width: '95%',        
    margin: '10px',
    marginBottom: '30px',
    maxWidth: '300px',           
  },
  roundedGrid: {
    borderRadius: 10, // Ajusta el valor según el radio de redondeo deseado
    height: '500px',
  },
});


function VerPedidos() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedVisibleRows, setSelectedVisibleRows] = useState([]);
  const [selectedFechaEntrega, setSelectedFechaEntrega] = useState(null);
  const [dialogAction, setDialogAction] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogMasivaOpen, setConfirmDialogMasivaOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filterEstadoPedido, setFilterEstadoPedido] = useState([]);
  const [filterEstadoPedidoDialog, setFilterEstadoPedidoDialog] = useState([]);
  const [filterEstadoPago, setFilterEstadoPago] = useState([]);
  const [filterEstadoPagoDialog, setFilterEstadoPagoDialog] = useState([]);
  const [filterLocalidad, setFilterLocalidad] = useState([]);
  const [filterLocalidadDialog, setFilterLocalidadDialog] = useState([]);
  const [filterNombreClienteValue, setFilterNombreClienteValue] = useState([]);
  const [filterNombreClienteOptions, setFilterNombreClienteOptions] = useState([]);
  const [filterNombreArticuloValue, setFilterNombreArticuloValue] = useState([]);
  const [filterNombreArticuloOptions, setFilterNombreArticuloOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
      const jsonGetAllPedidos = await getPedidosPendientes();      
      const pedidosConId = jsonGetAllPedidos.map(pedido => ({
        id: pedido._id,
        ...pedido,
        fecha_entrega:  pedido.fecha_entrega ? (pedido.fecha_entrega): null,
        fecha: (pedido.fecha),
      }));
      setPedidos(pedidosConId);      
      setLoading(false);
      }
      catch (error) {
        console.log("Error al cargar los pedidos:", error);
      }

    };
    fetchData();        
  }, [refreshCount]);
  //Formateo de fecha a horario UTC-3 BS AS

  const formatFecha = fecha => {
    const fechaUtc = new Date(fecha);
    const formattedFecha = utcToZonedTime(fechaUtc, 'America/Argentina/Buenos_Aires');
    const fechaFormateada = formatDate(formattedFecha, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx');    
    return fechaFormateada;
  };

  const formatFechaArg = fecha => {
    const fechaUtc = new Date(fecha);
    const formattedFecha = utcToZonedTime(fechaUtc, 'America/Argentina/Buenos_Aires');
    const fechaFormateada = formatDate(formattedFecha, 'dd-MM-yyyy\' \'HH:mm:ss');    
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

  const actualizarStockProducto = (productId, quantity) => {
    fetch(`https://vivosis-back-v2.vercel.app/api/producto/${productId}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(producto => {
        producto.stock += quantity;

        fetch(`https://vivosis-back-v2.vercel.app/api/producto/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(producto),
        })
          .then(response => response.json())
          .then(data => {
            //console.log('Stock del producto actualizado::', data);
          })
          .catch(error => {
            console.log('Error al actualizar el stock del producto:', error);
          });
      })
      .catch(error => {
        console.log('Error al obtener el producto:', error);
      });
  };


  
  const confirmActMasiva = async () => {
    setConfirmDialogMasivaOpen(false);
    const selectedPedidos = pedidos.filter(pedido => selectedRows.includes(pedido.id));
    const cantidadRegistros = selectedPedidos.length;
  
    if (selectedPedidos.length === 0) {
      const noRecordsConfirmation = window.alert(
        'No hay registros seleccionados para actualizar.'
      );  
      return
    }

    // Mostrar una alerta y pedir confirmación al usuario
    const confirmacion = window.confirm(
      `Estás a punto de actualizar ${cantidadRegistros} registros. ¿Deseas continuar?`
    );
  
    if (!confirmacion) {
      // Si el usuario cancela, no se realiza ninguna acción
      console.log('Actualización masiva cancelada por el usuario.');
      return; // Agregar el return aquí
    }
  
    // Verificar si no hay registros seleccionados para actualizar
   
  
    if (dialogAction === 'modificarLocalidad') {
      // actualizar pedidos seleccionados utilizando guardarCambiosEnProducto
      for (const pedido of selectedPedidos) {
        pedido.localidad = filterLocalidadDialog;
        pedido.fecha_entrega = pedido.fecha_entrega ? formatFecha(pedido.fecha_entrega) : null;
        pedido.fecha = pedido.fecha ? formatFecha(pedido.fecha) : null;
        try {
          const result = await actualizarPedido(pedido);
          setRefreshCount(prevCount => prevCount + 1);
        } catch (error) {
          console.log('Error al actualizar el pedido:', error);
        }
      }
    } else if (dialogAction === 'modificarEstadoPago') {
      for (const pedido of selectedPedidos) {
        pedido.estado_pago = filterEstadoPagoDialog;
        pedido.fecha_entrega = pedido.fecha_entrega ? formatFecha(pedido.fecha_entrega) : null;
        pedido.fecha = pedido.fecha ? formatFecha(pedido.fecha) : null;
        try {
          const result = await actualizarPedido(pedido);
          setRefreshCount(prevCount => prevCount + 1);
        } catch (error) {
          console.log('Error al actualizar el pedido:', error);
        }
      }
    } else if (dialogAction === 'modificarFechaEntrega') {
      for (const pedido of selectedPedidos) {
        pedido.fecha_entrega = selectedFechaEntrega ? formatFecha(selectedFechaEntrega) : null;
        pedido.fecha = pedido.fecha ? formatFecha(pedido.fecha) : null;
        try {
          const result = await actualizarPedido(pedido);
          setRefreshCount(prevCount => prevCount + 1);
        } catch (error) {
          console.log('Error al actualizar el pedido:', error);
        }
      }
    } else if (dialogAction === 'modificarEstadoPedido') {
      for (const pedido of selectedPedidos) {
        pedido.estado_pedido = filterEstadoPedidoDialog;
        pedido.fecha_entrega = pedido.fecha_entrega ? formatFecha(pedido.fecha_entrega) : null;
        pedido.fecha = pedido.fecha ? formatFecha(pedido.fecha) : null;
        try {
          const result = await actualizarPedido(pedido);
          setRefreshCount(prevCount => prevCount + 1);
        } catch (error) {
          console.log('Error al actualizar el pedido:', error);
        }
      }
    }
  };
  
  

  const handleUpdateLocalidad = () => {
    setDialogAction('modificarLocalidad');
    setConfirmDialogMasivaOpen(true);
    setFilterLocalidadDialog('');
    
  };
  
  const handleUpdateEstadoPedido = () => {
    setDialogAction('modificarEstadoPedido');
    setConfirmDialogMasivaOpen(true);
  };
  
  const handleUpdateEstadoPago = () => {
    setDialogAction('modificarEstadoPago');
    setConfirmDialogMasivaOpen(true);
  };
  
  const handleUpdateFechaEntrega = () => {
    setDialogAction('modificarFechaEntrega');
    setConfirmDialogMasivaOpen(true);
  };


  const confirmDelete = () => {
    setConfirmDialogOpen(false);
    const pedidoAEliminar = pedidos.find(pedido => pedido.id === selectedPedido);
    //console.log('PedidoAEliminar: ', pedidoAEliminar);
    actualizarStockProducto(pedidoAEliminar.id_articulo, pedidoAEliminar.cantidad);
    fetch(`https://vivosis-back-v2.vercel.app/api/pedido/${selectedPedido}`, {
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

  
  const handleEdit = id => {
    console.log(id);
    navigate(`/ModificarPedido/${id}`);
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };
  const handleCancelMasiva = () => {
    setConfirmDialogMasivaOpen(false);
  };
  
  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

  const handleFilterLocalidadChange = (event, value) => {
    setFilterLocalidad(value);
  };
  const getOptionLabel = (option) => option.label;

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

    const filteredPedidosByLocalidad = filterLocalidad.length > 0
    ? filteredPedidosByEstadoPago.filter((pedido) =>
        filterLocalidad.some((localidad) => localidad.value === pedido.localidad) // Filtrar usando objetos completos
      )
    : filteredPedidosByEstadoPago;

    
  const filteredPedidosByNombreCliente = filterNombreClienteValue.length > 0
    ? filteredPedidosByLocalidad.filter(pedido => filterNombreClienteValue.includes(pedido.nombre_cliente))
    : filteredPedidosByLocalidad;

  const filteredPedidosByNombreArticulo = filterNombreArticuloValue.length > 0
    ? filteredPedidosByNombreCliente.filter(pedido => filterNombreArticuloValue.includes(pedido.nombre_articulo))
    : filteredPedidosByNombreCliente;

    const calculateSum = (rows, field) => {
      return rows.reduce((sum, row) => sum + row[field], 0);
      
    };
    
    const sumCantidad = calculateSum(filteredPedidosByNombreArticulo, 'cantidad');
    const sumTotal = calculateSum(filteredPedidosByNombreArticulo, 'total');
    

    const columns = [
      {
        field: 'seleccionado',
        headerName: 'Seleccionado',
        flex: 0.8,
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => (
          <Checkbox
            checked={selectedVisibleRows.length === filteredPedidosByNombreArticulo.length}
            indeterminate={selectedVisibleRows.length > 0 && selectedVisibleRows.length < filteredPedidosByNombreArticulo.length}
            onChange={handleSelectAll}
          />
        ),
        renderCell: params => (
          <Checkbox
            checked={selectedVisibleRows.includes(params.row.id)}
            onChange={() => handleSelect(params.row.id)}
          />
        ),
        sortComparator: null,
        sortable: false,
        filterable: false,
        hideable: false,
        manageable: false,
        
      },
      { field: 'fecha', headerName: 'Fecha', flex: 1 , type: 'Date' },
      { field: 'nombre_cliente', headerName: 'Cliente', flex: 1.2 },
      { field: 'localidad', headerName: 'Localidad', flex: 0.8 },
      { field: 'nombre_articulo', headerName: 'Artículo', flex: 1.5 },
      { field: 'cantidad', headerName: 'Cantidad', flex: 0.4 },
      { field: 'precio', headerName: 'Precio', flex: 0.3 },
      { field: 'total', headerName: 'Total', flex: 0.2 },
      { field: 'costo', headerName: 'Costo', flex: 0.2 },
      { field: 'estado_pedido', headerName: 'Estado Pedido', flex: 0.5 },
      { field: 'estado_pago', headerName: 'Estado Pago', flex: 0.5 },
      { field: 'fecha_entrega', headerName: 'F. entrega', flex: 0.8 , type: 'Date'  },
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
        sortComparator: null,
        sortable: false,
        filterable: false,
        hideable: false,
        manageable: false,
      }
    ];
    
  const handleDelete = id => {
    setSelectedPedido(id);
    setConfirmDialogOpen(true);
  };

  const handleCrearPedido = () => {
    navigate('/CrearPedido');
  };
  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      // Si la casilla de verificación del encabezado está marcada, seleccionar todas las filas visibles
      setSelectedVisibleRows(filteredPedidosByNombreArticulo.map(pedido => pedido.id));
      setSelectedRows(filteredPedidosByNombreArticulo.map(pedido => pedido.id));
    } else {
      // Si la casilla de verificación del encabezado no está marcada, deseleccionar todas las filas visibles
      setSelectedVisibleRows([]);
      setSelectedRows([]);
    }
  };

  const handleSelect = (id) => {
    // Check if the row is already selected
    const isRowSelected = selectedRows.includes(id);

    // If it's selected, remove it from the selection
    if (isRowSelected) {
      setSelectedVisibleRows(prevSelectedRows => prevSelectedRows.filter(rowId => rowId !== id));
      setSelectedRows(prevSelectedRows => prevSelectedRows.filter(rowId => rowId !== id));
    } else {
      // If it's not selected, add it to the selection
      setSelectedVisibleRows(prevSelectedRows => [...prevSelectedRows, id]);
      setSelectedRows(prevSelectedRows => [...prevSelectedRows, id]);
    }
  };
  const estadosPedido = ['PENDIENTE', 'PREPARADO', 'FINALIZADO', 'CANCELADO'];
  const estadosPago = ['PENDIENTE', 'ABONADO'];
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

  return (
    <div className={classes.root}>
      {loading ? (
        <Box>Cargando pedidos...</Box>
      ) : (
        <>
        <Card className={classes.card}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom className={classes.h4}>
              Pedidos pendientes
            </Typography>
            
            <Button variant="contained" startIcon={<AddIcon />}className={classes.button}onClick={handleCrearPedido} size="medium">
              Nuevo Pedido
            </Button>
          </Stack>
          <Grid container className={classes.filtersContainer}>
          <Grid item xs={2} >
              
              <TextField
                className={classes.filterInput}
                size='small'
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
            </Grid>

            <Grid item xs={2}>
              <Autocomplete 
                size='small'
                multiple
                options={estadosPedido}
                value={filterEstadoPedido}
                onChange={handleFilterEstadoPedidoChange}
                renderInput={params => (
                  <TextField {...params} label="Estado Pedido" variant="outlined" className={classes.filterInput}size='small'  />
                )}
              />
            </Grid>   
            <Grid item xs={2}>
              <Autocomplete 
                size='small'
                multiple
                options={estadosPago}
                value={filterEstadoPago}
                onChange={handleFilterEstadoPagoChange}
                renderInput={params => (
                  <TextField {...params} label="Estado Pago" variant="outlined" className={classes.filterInput}size='small'  />
                )}
              />
            </Grid>   
            <Grid item xs={2}>
              <Autocomplete 
                size='small'
                getOptionLabel={getOptionLabel}
                multiple
                options={listaLocalidades}
                value={filterLocalidad}
                onChange={handleFilterLocalidadChange}
                renderInput={params => (
                  <TextField {...params} label="Localidad" variant="outlined" className={classes.filterInput}size='small'  />
                )}
              />
            </Grid>      
            <Grid item xs={2}>
              <Autocomplete 
                size='small'
                fullWidth
                multiple
                options={filterNombreClienteOptions}
                value={filterNombreClienteValue}
                onChange={handleFilterNombreClienteChange}
                renderInput={params => (
                  <TextField {...params} label="Nombre Cliente" variant="outlined" className={classes.filterInput}size='small'  />
                )}
              />
            </Grid>
            
            <Grid item xs={2}>
              <Autocomplete 
                fullWidth
                size='small'
                multiple
                options={filterNombreArticuloOptions}
                value={filterNombreArticuloValue}
                onChange={handleFilterNombreArticuloChange}
                renderInput={params => (
                  <TextField {...params} label="Nombre Artículo" variant="outlined" className={classes.filterInput}size='small' fullWidth />
                )}
              />
            </Grid>
            
          </Grid>
          <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={1}padding={2}>
                      
            <Button variant="contained"  startIcon={<EditIcon />}className={classes.button}onClick={handleUpdateLocalidad} size="small">
              Localidad
            </Button>
            <Button variant="contained" startIcon={<EditIcon />}className={classes.button}onClick={handleUpdateEstadoPedido} size="small">
              Estado Pedido
            </Button>
            <Button variant="contained" startIcon={<EditIcon />}className={classes.button}onClick={handleUpdateEstadoPago} size="small">
              Estado Pago
            </Button>
            <Button variant="contained" startIcon={<EditIcon />}className={classes.button}onClick={handleUpdateFechaEntrega} size="small">
              f. entrega
            </Button>
          </Stack>
          <Paper className={classes.roundedGrid}>
            <DataGrid 
              rows={filteredPedidosByNombreArticulo}
              columns={columns}
              pageSize={25}
              showFooter
              disableRowSelectionOnClick
              footerHeight={40}
              density="compact"
              
            />
          </Paper>
        </Card>
        <Dialog open={confirmDialogMasivaOpen} onClose={handleCancelMasiva}>
            <DialogTitle>Modificación masiva de pedidos</DialogTitle>
            <DialogContent>
              
                {dialogAction === 'modificarLocalidad' && (
                <Autocomplete
                  size="small"
                  options={listaLocalidades}                  
                  value={filterLocalidadDialog}                  
                  onChange={(event, newValue) => setFilterLocalidadDialog(newValue.value)}
                  renderInput={(params) => <TextField {...params} variant="outlined" />}
                />
                  )}
              
                {dialogAction === 'modificarEstadoPedido' && (
                  <Autocomplete
                    size="small"
                    options={estadosPedido}
                    value={filterEstadoPedidoDialog}
                    onChange={(event, newValue) => setFilterEstadoPedidoDialog(newValue)}
                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                  />
                )}
                {dialogAction === 'modificarEstadoPago' && (
                  <Autocomplete
                    size="small"
                    options={estadosPago}
                    value={filterEstadoPagoDialog}
                    onChange={(event, newValue) => setFilterEstadoPagoDialog(newValue)}
                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                  />
                )}
                {dialogAction === 'modificarFechaEntrega' && (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={selectedFechaEntrega}
                      onChange={(newValue) => setSelectedFechaEntrega(newValue)}
                      renderInput={(params) => <TextField {...params} variant="outlined" />}
                    />
                  </LocalizationProvider>
                )}


            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelMasiva} color="primary">
                Cancelar
              </Button>
              <Button onClick={confirmActMasiva} color="primary" autoFocus>
                Actualizar
              </Button>
            </DialogActions>
          </Dialog>

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