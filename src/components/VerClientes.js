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
import { Box } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { getPuntosEntrega } from './api/puntoEntrega/puntoEntrega';
import { listaEstados } from './api/cliente/cliente';

const useStyles = makeStyles({
  root: {
    height: 400,
    width: '100%',
    margin: '10px auto',
    '& .MuiDataGrid-root': {
      border: '1px solid #ccc',
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
  filtersContainer: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  filterInput: {
    width: '180px',
  },
});

function VerClientes() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [listaPuntosEntrega, setListaPuntosEntrega] = useState([]);

  useEffect(() => {
    fetch('https://vivosis-back-v2.vercel.app/api/cliente/getallclientes')
      .then(response => response.json())
      .then(data => {        
        const clientesConId = data.map(cliente => ({
          id: cliente.id,
          ...cliente
        }));
        setClientes(clientesConId);
        setLoading(false);
      })
      .catch(error => {
        console.log('Error al cargar los clientes:', error);
        setLoading(false);
      });

      const fetchPuntosEntrega = async () => {
        const listaPuntosEntrega = await getPuntosEntrega();        
        setListaPuntosEntrega(listaPuntosEntrega);  
        
      }       
      fetchPuntosEntrega();
  }, [refreshCount]);

  const handleEdit = id => {
    console.log(id);
    navigate(`/ModificarCliente/${id}`);
  };

  const handleDelete = id => {
    setSelectedClient(id);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    setConfirmDialogOpen(false);
    fetch(`https://vivosis-back-v2.vercel.app/api/cliente/${selectedClient}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        setRefreshCount(prevCount => prevCount + 1);
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.log('Error al eliminar el cliente:', error);
      });
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSearch = event => {
    setSearchText(event.target.value);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'telefono', headerName: 'Teléfono', flex: 1 },
    { field: 'direccion', headerName: 'Dirección', flex: 1 },
    { field: 'punto_entrega', headerName: 'P. Entrega', flex: 1,  valueGetter: params => {
      const puntoEntregaId = params.row.punto_entrega;
      const puntoEntrega = listaPuntosEntrega.find(punto => punto.id === puntoEntregaId);
      return puntoEntrega ? puntoEntrega.nombre : ''; // Si se encuentra el punto de entrega, devuelve su nombre, de lo contrario devuelve una cadena vacía
    }, },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1, valueGetter: params => {
      const estadoId = params.row.estado;
      const estado = listaEstados.find(estado => estado.id === estadoId);
      return estado ? estado.nombre : ''; // Si se encuentra el estado, devuelve su nombre, de lo contrario devuelve una cadena vacía
     },},
    { field: 'comentarios', headerName: 'Comentarios', flex: 1 },            
    { field: 'origen', headerName: 'Origen', flex: 1 }, 
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 0.5,
      renderCell: params => (
        <>
          <IconButton aria-label="Editar" onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="Eliminar" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleCrearCliente = () => {
    navigate('/CrearCliente');
  };

  return (
    <div className={classes.root}>
      {loading ? (
        <div>Cargando clientes...</div>
      ) : (
        <>
        <br/><br/><br/>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleCrearCliente} size="large" endIcon={<CreateIcon />} >
            Crear Cliente
          </Button>
        </Box>               
          <br/><br/><br/>
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
          <DataGrid rows={filteredClientes} columns={columns} components={{ Toolbar: GridToolbar }} disableRowSelectionOnClick density='compact' />

          <Dialog open={confirmDialogOpen} onClose={handleCancelDelete}>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Estás seguro de que deseas eliminar este cliente?
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
              Cliente eliminado correctamente.
            </MuiAlert>
          </Snackbar>
        </>
      )}
    </div>
  );
}

export default VerClientes;
