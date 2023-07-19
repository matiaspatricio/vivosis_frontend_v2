import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import { Card, Box, Typography, TextField } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Alert from '@mui/material/Alert';

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

function EnviosClientes() {
  const classes = useStyles();
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get('https://vivosis.vercel.app/api/pedido/getpedidospendientes');
        const data = response.data;
        setPedidos(data);
        setLoading(false);
      } catch (error) {
        console.log('Error al obtener los pedidos:', error);
        setLoading(false);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await axios.get('https://vivosis.vercel.app/api/cliente/getallclientes');
        const data = response.data;
        setClientes(data);
      } catch (error) {
        console.log('Error al obtener los clientes:', error);
      }
    };

    fetchPedidos();
    fetchClientes();
  }, []);

  const totalPendiente = pedidos.reduce((total, pedido) => {
    if (pedido.estado_pago !== 'ABONADO') {
      return total + (pedido.total || 0);
    }
    return total;
  }, 0);

  const handleCopyToClipboard  = async (cliente) => {
    setCopied(true);
    
    
    const pedidosCliente = pedidos.filter((pedido) => pedido.nombre_cliente === cliente);
    setMensaje(`Hola 😁👋🏻 Soy Narela del vivo de maquillajes 😊, te dejo tu total *(El total del pedido esta en "leer mas" abajo de todo)* :

  Detalle de tu pedido:
    Cliente: ${pedidosCliente[0].nombre_cliente}
    Localidad: ${pedidosCliente[0].localidad}
    Fecha de entrega: ${pedidosCliente[0].fecha_entrega}
    Total a pagar: $ ${pedidosCliente.reduce((total, pedido) => total + (pedido.estado_pago !== 'ABONADO' ? (pedido.total || 0) : 0), 0)}
  
  Productos que compraste:
  ${pedidosCliente
    .map(
      (pedido) => `
    Producto: ${pedido.nombre_articulo}
    Cantidad: ${pedido.cantidad}
    Precio unitario: $${pedido.precio || 0}
    Total de este producto: $${pedido.total || 0}
    Comentarios: ${pedido.comentarios}
  --------------------------------------
  `
    )
    .join('')}
  `);


    setTimeout(() => {
      setCopied(false);
    }, 1500); // Duración del mensaje en milisegundos (ej. 3000ms = 3 segundos)
  };

  const handleDetalle = async (cliente) => {
    const pedidosCliente = pedidos.filter((pedido) => pedido.nombre_cliente === cliente);
    setMensaje('');
    setMensaje(`Hola 😁👋🏻 Soy Narela del vivo de maquillajes 😊, te dejo tu total *(El total del pedido esta en "leer mas" abajo de todo)* :

  Detalle de tu pedido:
    Cliente: ${pedidosCliente[0].nombre_cliente}
    Localidad: ${pedidosCliente[0].localidad}
    Fecha de entrega: ${pedidosCliente[0].fecha_entrega}
    Total a pagar: $ ${pedidosCliente.reduce((total, pedido) => total + (pedido.estado_pago !== 'ABONADO' ? (pedido.total || 0) : 0), 0)}
  
  Productos que compraste:
  ${pedidosCliente
    .map(
      (pedido) => `
    Producto: ${pedido.nombre_articulo}
    Cantidad: ${pedido.cantidad}
    Precio unitario: $${pedido.precio || 0}
    Total de este producto: $${pedido.total || 0}
    Total a pagar de este producto: $${pedido.estado_pago === 'ABONADO' ? 0 :pedido.total}
    Comentarios: ${pedido.comentarios}
  --------------------------------------
  `
    )
    .join('')}
  `);

    const clienteData = clientes.find((c) => c.nombre === cliente);
    if (!clienteData) {
      console.log('No se encontraron datos del cliente');
      return;
    }

    const telefonoCliente = clienteData.telefono;
    const enlace = `https://api.whatsapp.com/send?phone=${telefonoCliente}&text=${encodeURIComponent(mensaje)}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(enlace, '_blank');
  };

  const sumarizarPedidosPorCliente = () => {
    const pedidosPorCliente = {};
    pedidos.forEach((pedido) => {
      const { nombre_cliente, total, fecha_entrega, localidad } = pedido;
      if (!pedidosPorCliente[nombre_cliente]) {
        pedidosPorCliente[nombre_cliente] = {
          id: nombre_cliente, // Agregar una propiedad "id" para evitar una advertencia en el DataGrid
          cliente: nombre_cliente,
          total: pedido.estado_pago === 'ABONADO' ? 0 : total, // Establecer el total en 0 si el estado de pago es 'ABONADO'
          fecha_entrega: fecha_entrega,
          localidad: localidad,
        };
      } else {
        pedidosPorCliente[nombre_cliente].total += pedido.estado_pago === 'ABONADO' ? 0 : total; // Sumar al total solo si el estado de pago no es 'ABONADO'
      }
    });
    return Object.values(pedidosPorCliente);
  };

  const pedidosPorCliente = sumarizarPedidosPorCliente();

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredPedidosPorCliente = pedidosPorCliente.filter((pedido) =>
    pedido.cliente.toLowerCase().includes(searchValue.toLowerCase())
  );

  const sortedPedidosPorCliente = filteredPedidosPorCliente.sort((a, b) => {
    const clienteA = a.cliente.toLowerCase();
    const clienteB = b.cliente.toLowerCase();
    if (clienteA < clienteB) {
      return -1;
    }
    if (clienteA > clienteB) {
      return 1;
    }
    return 0;
  });

  const columns = [
    { field: 'cliente', headerName: 'Cliente', flex: 1 },
    { field: 'total', headerName: 'Total a pagar', flex: 1 },
    { field: 'fecha_entrega', headerName: 'Fecha de Entrega', flex: 1 },
    { field: 'localidad', headerName: 'Localidad', flex: 1 },
    { field: 'estado_pedido', headerName: 'Estado del Pedido', flex: 1 },
    { field: 'estado_pago', headerName: 'Estado del Pago', flex: 1 },
    {
      field: 'detalle',
      headerName: 'Detalle',
      flex: 1,
      align: 'center',
      renderCell: (params) => (
        <Box>
          <Button variant="contained" color="primary" onClick={() => handleDetalle(params.row.cliente)} size="small" style={{ marginLeft: 16 }}>
            ENVIAR
          </Button>
          <CopyToClipboard text={mensaje} onCopy={() => handleCopyToClipboard(params.row.cliente)}>
            <Button variant="contained" color="primary" size="small" style={{ marginLeft: 16 }}>
              Copiar
            </Button>
          </CopyToClipboard>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h3" sx={{ margin: 5 }} align="left">
        Resumen de Pedidos por Cliente
      </Typography>
      {loading ? (
        <div>Cargando clientes...</div>
      ) : (
        <Box className={classes.root}>
          <Box style={{ height: 600, width: '80%' }} align="left" margin={7}>
            <TextField
              label="Buscar por cliente"
              variant="outlined"
              margin="dense"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <DataGrid
              rows={sortedPedidosPorCliente}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              disableRowSelectionOnClick
              density="compact"
            />
          </Box>
        </Box>
      )}
      <Box style={{ margin: '1rem 0' }} align="center">
        {copied && (
          <Alert severity="success">
            Mensaje copiado al portapapeles.
          </Alert>
        )}
      </Box>
    </Box>
  );
}

export default EnviosClientes;
