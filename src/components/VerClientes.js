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
    centerButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
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

  useEffect(() => {
    fetch('https://vivosis.vercel.app/api/cliente/getallclientes')
      .then(response => response.json())
      .then(data => {
        const clientesConId = data.map(cliente => ({
          id: cliente._id,
          ...cliente
        }));
        setClientes(clientesConId);
        setLoading(false);
      })
      .catch(error => {
        console.log('Error al cargar los clientes:', error);
        setLoading(false);
      });
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
    fetch(`https://vivosis.vercel.app/api/cliente/${selectedClient}`, {
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
    { field: 'localidad', headerName: 'Localidad', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1 },
    { field: 'usuario', headerName: 'Usuario', flex: 1 },
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleCrearCliente}>
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
