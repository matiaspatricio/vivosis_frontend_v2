import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import { Card,Box, Typography } from '@mui/material';


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


  const handleDetalle = async cliente => {
    const pedidosCliente = pedidos.filter(pedido => pedido.nombre_cliente === cliente);
    const mensaje = `Hola 😁👋🏻 Soy Narela del vivo de maquillajes 😊, te dejo tu total *(El total del pedido esta en "leer mas" abajo de todo)* :

  Detalle de tu pedido:
    Cliente: ${pedidosCliente[0].nombre_cliente}
    Localidad: ${pedidosCliente[0].localidad}
    Fecha de entrega: ${pedidosCliente[0].fecha_entrega}
    Total: $ ${pedidosCliente.reduce((total, pedido) => total + (pedido.estado_pago !== 'ABONADO' ? (pedido.total || 0) : 0), 0)}
  
  Productos que compraste:
  ${pedidosCliente
    .map(
      pedido => `
    Producto: ${pedido.nombre_articulo}
    Cantidad: ${pedido.cantidad}
    Precio unitario:$ ${pedido.precio || 0}
    Total de este producto:$ ${pedido.total || 0}
    Comentarios: ${pedido.comentarios}
  --------------------------------------
  `
    )
    .join('')}
  `;

    const clienteData = clientes.find(c => c.nombre === cliente);
    if (!clienteData) {
      console.log('No se encontraron datos del cliente');
      return;
    }

    const telefonoCliente = clienteData.telefono;
    const enlace = `https://api.whatsapp.com/send?phone=${telefonoCliente}&text=${encodeURIComponent(mensaje)}`;


    //const telefonoCliente = '+5491167892872'; // Número de teléfono del cliente
    //const enlace = `https://api.whatsapp.com/send?phone=${telefonoCliente}&text=${encodeURIComponent(mensaje)}`;
  


    // Abrir WhatsApp en una nueva pestaña
    window.open(enlace, '_blank');
  };

  const sumarizarPedidosPorCliente = () => {
    const pedidosPorCliente = {};
    pedidos.forEach(pedido => {
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

  const columns = [
    { field: 'cliente', headerName: 'Cliente', flex: 1 },
    { field: 'total', headerName: 'Total', flex: 1 },
    { field: 'fecha_entrega', headerName: 'Fecha de Entrega', flex: 1 },
    { field: 'localidad', headerName: 'Localidad', flex: 1 },
    {
      field: 'detalle',
      headerName: 'Detalle',
      flex: 1, align : 'center',
      renderCell: params => (
        <Button variant="contained" color="primary" onClick={() => handleDetalle(params.row.cliente)}         size="small"
        style={{ marginLeft: 16 }} >
          ENVIAR
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant='h3' sx={{margin:5}} align='left' >Resumen de Pedidos por Cliente</Typography>
    {loading ? (
      <div>Cargando clientes...</div>
    ) : (
      <>
      
    <Box className={classes.root}>
    <Box style={{ maxHeight: '10%', maxWidth: '20%' }} align='left' >
      <Card sx={{margin:6}} align='left' ><Typography variant='h6' gutterBottom align='center'>Total pendiente: ${totalPendiente}</Typography></Card>
    </Box>
      <Box style={{ height: 600, width: '80%' }} align='left' margin={7} >
        <DataGrid rows={pedidosPorCliente} columns={columns} components={{ Toolbar: GridToolbar }} disableRowSelectionOnClick density='compact' />
      </Box>
    </Box>
    
    </>
    )}
    </Box>
  );
}

export default EnviosClientes;
