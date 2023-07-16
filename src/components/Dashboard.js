import { useEffect, useState } from "react";
import { Typography, Card, CardContent, Grid } from "@mui/material";
import { startOfToday, subDays, format } from 'date-fns';

const Dashboard = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [pedidosPreparados, setPedidosPreparados] = useState([]);
  const [clientesConPedidosPendientes, setClientesConPedidosPendientes] = useState([]);
  const [clientesConPedidosPreparados, setClientesConPedidosPreparados] = useState([]);
  const [dineroPendiente, setDineroPendiente] = useState(0);
  const [totalHoy, setTotalHoy] = useState(0);
  const [totalUltimos7Dias, setTotalUltimos7Dias] = useState(0);
  const [fechaHoy, setFechaHoy] = useState("");
  const [totalAyer, setTotalAyer] = useState(0);

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
        
        const today = startOfToday();
        const last7Days = subDays(today, 7);
        const yesterday = subDays(today, 1);

        const pedidosHoy = data.filter((pedido) => {
          const fechaPedido = new Date(pedido.fecha);
          return fechaPedido >= today;
        });

        const pedidosUltimos7Dias = data.filter((pedido) => {
          const fechaPedido = new Date(pedido.fecha);
          return fechaPedido >= last7Days && fechaPedido <= today;
        });

        const pedidosAyer = data.filter((pedido) => {
          const fechaPedido = new Date(pedido.fecha);
          return fechaPedido >= yesterday && fechaPedido < today;
        });

        const totalHoy = pedidosHoy.reduce((total, pedido) => total + pedido.total, 0);
        const totalUltimos7Dias = pedidosUltimos7Dias.reduce((total, pedido) => total + pedido.total, 0);
        const totalAyer = pedidosAyer.reduce((total, pedido) => total + pedido.total, 0);

        setTotalHoy(totalHoy);
        setTotalUltimos7Dias(totalUltimos7Dias);
        setTotalAyer(totalAyer);
        
        const formattedToday = format(today, "EEE MMM dd yyyy HH:mm:ss 'GMT'XXX '(Coordinated Universal Time)'");
        setFechaHoy(formattedToday);
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
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total de hoy ({fechaHoy})
            </Typography>
            <Typography variant="h4">${totalHoy}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total de ayer
            </Typography>
            <Typography variant="h4">${totalAyer}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total de últimos 7 días
            </Typography>
            <Typography variant="h4">${totalUltimos7Dias}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
