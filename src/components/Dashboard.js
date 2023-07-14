import { useEffect, useState } from "react";
import { Typography, Card, CardContent, Grid } from "@mui/material";

const Dashboard = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [pedidosPreparados, setPedidosPreparados] = useState([]);
  const [clientesConPedidosPendientes, setClientesConPedidosPendientes] = useState([]);
  const [clientesConPedidosPreparados, setClientesConPedidosPreparados] = useState([]);
  const [dineroPendiente, setDineroPendiente] = useState(0);

  useEffect(() => {
    fetch("https://vivosis.vercel.app/api/pedido/getPedidosPendientes")
      .then((response) => response.json())
      .then((data) => {
        setPedidosPendientes(data.filter((pedido) => pedido.estado_pedido === "PENDIENTE"));
        setPedidosPreparados(data.filter((pedido) => pedido.estado_pedido === "PREPARADO"));
        setClientesConPedidosPendientes(Array.from(new Set(data.map((pedido) => pedido.nombre_cliente))));
        setClientesConPedidosPreparados(
          Array.from(new Set(data.filter((pedido) => pedido.estado_pedido === "PREPARADO").map((pedido) => pedido.nombre_cliente)))
        );
        setDineroPendiente(data.filter((pedido) => pedido.estado_pago === "PENDIENTE").reduce((total, pedido) => total + pedido.total, 0));
      })
      .catch((error) => {
        console.log("Error al cargar los pedidos:", error);
      });
  }, []);

  return (
    <Grid container spacing={2} mt={5}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pedidos pendientes
            </Typography>
            <Typography variant="h4">{pedidosPendientes.length}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pedidos preparados
            </Typography>
            <Typography variant="h4">{pedidosPreparados.length}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Clientes con pedidos pendientes
            </Typography>
            <Typography variant="h4">{clientesConPedidosPendientes.length}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Clientes con pedidos preparados
            </Typography>
            <Typography variant="h4">{clientesConPedidosPreparados.length}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dinero pendiente de cobro
            </Typography>
            <Typography variant="h4">${dineroPendiente}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
