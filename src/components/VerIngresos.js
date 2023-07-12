import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

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

function VerIngresos() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshCount, setRefreshCount] = useState(0); // Nuevo estado para contar las actualizaciones
  const [selectedIngreso, setSelectedIngreso] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetch('https://vivosis.vercel.app:3001/api/ingreso/getAllIngresos')
      .then(response => response.json())
      .then(data => {
        const ingresosConId = data.map(ingreso => ({
          id: ingreso._id,
          ...ingreso
        }));        
        setIngresos(ingresosConId);
        setLoading(false);        
      })
      .catch(error => {
        console.log('Error al cargar los ingresos:', error);
        setLoading(false);
      });
  }, [refreshCount]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEdit = id => {
    console.log(id);
    navigate(`/ModificarIngreso/${id}`);
  };
  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };

  const confirmDelete = () => {
    setConfirmDialogOpen(false);
    fetch(`https://vivosis.vercel.app:3001/api/ingreso/${selectedIngreso}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        setRefreshCount(prevCount => prevCount + 1); // Incrementar el contador para forzar la actualización de la grilla
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.log('Error al eliminar el cliente:', error);
      });
  };
  const handleDelete = id => {
    setSelectedIngreso(id);
    setConfirmDialogOpen(true);
  };

  const handleSearch = event => {
    setSearchText(event.target.value);
  };

  const filteredIngresos = ingresos.filter(ingreso =>
    ingreso.nombre_articulo.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { field: 'fecha_ingreso', headerName: 'Fecha Ingreso', flex: 1 },
    { field: 'nombre_articulo', headerName: 'Nombre Artículo', flex: 1 },
    { field: 'cantidad', headerName: 'Cantidad', flex: 1 },
    { field: 'costo_unitario', headerName: 'Costo Unitario', flex: 1 },
    { field: 'precio', headerName: 'Precio', flex: 1 },
    { field: 'total', headerName: 'Total', flex: 1 },
    { field: 'motivo', headerName: 'Motivo', flex: 1 },    
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
        </>
      ),
    },
  ];

  const handleCrearIngreso = () => {
    navigate('/CrearIngreso');
  };

  return (
    <div className={classes.root}>
      {loading ? (
        <div>Cargando ingresos...</div>
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
            rows={filteredIngresos}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
          <div className={classes['center-button']}>
            <Button variant="contained" color="primary" onClick={handleCrearIngreso}>
              Crear Ingreso
            </Button>
          </div>
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

export default VerIngresos;
