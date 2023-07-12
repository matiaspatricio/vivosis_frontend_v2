import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
  root: {
    height: 400,
    width: '80%',
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

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get('http://192.168.0.10:3001/api/pedido/getPedidosPendientes');
        const data = response.data;
        setPedidos(data);
      } catch (error) {
        console.log('Error al obtener los pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  const handleDetalle = cliente => {
    const pedidosCliente = pedidos.filter(pedido => pedido.nombre_cliente === cliente);
    const mensaje = `Hola 😁👋🏻 Soy Narela del vivo de maquillajes 😊, te dejo tu total *(El total del pedido esta en "leer mas" abajo de todo)* :


  Detalle de tu pedido:

    Cliente: ${pedidosCliente[0].nombre_cliente}
    Localidad: ${pedidosCliente[0].localidad}
    Fecha de entrega: ${pedidosCliente[0].fecha_entrega}
    Total: $ ${pedidosCliente.reduce((total, pedido) => total + (pedido.total || 0), 0)}
  
  Productos que compraste:

  ${pedidosCliente.map(pedido => `
    Producto: ${pedido.nombre_articulo}
    Cantidad: ${pedido.cantidad}
    Precio unitario:$ ${pedido.precio || 0}
    Total de este producto:$ ${pedido.total || 0}
    Comentarios: ${pedido.comentarios}
  --------------------------------------
  `
    ).join('')}
  `;
  
    const telefonoCliente = '+5491167892872'; // Número de teléfono del cliente
    const enlace = `https://api.whatsapp.com/send?phone=${telefonoCliente}&text=${encodeURIComponent(mensaje)}`;
  
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
          total: total,
          fecha_entrega: fecha_entrega,
          localidad: localidad
        };
      } else {
        pedidosPorCliente[nombre_cliente].total += total;
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
      flex: 1,
      renderCell: params => (
        <Button variant="contained" color="primary" onClick={() => handleDetalle(params.row.cliente)}>
          Detalle
        </Button>
      )
    }
  ];

  return (
    <div className={classes.root}>
      <h2>Resumen de Pedidos por Cliente</h2>
      <div style={{ height: 400, width: '80%' }}>
        <DataGrid
          rows={pedidosPorCliente}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </div>
    </div>
  );
}

export default EnviosClientes;
