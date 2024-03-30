import { useEffect, useState } from "react";
import { Typography, Card, CardContent, Grid } from "@mui/material";
import { startOfToday, subDays, format } from 'date-fns';
import { getPedidosPendientes, getPedidosMes, getPedidosSemana, getPedidosAyer , getPedidosHoy, getPedidosSemanaAnterior } from "./api/pedido/pedido";

const Dashboard = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [pedidosPreparados, setPedidosPreparados] = useState([]);
  const [clientesConPedidosPendientes, setClientesConPedidosPendientes] = useState([]);
  const [clientesConPedidosPreparados, setClientesConPedidosPreparados] = useState([]);
  const [pedidosHoy, setPedidosHoy] = useState([]); 
  const [pedidosAyer, setPedidosAyer] = useState([]);
  const [pedidosSemana, setPedidosSemana] = useState([]); 
  const [pedidosSemanaAnterior, setPedidosSemanaAnterior] = useState([]); 
  
  const [dineroPendiente, setDineroPendiente] = useState(0);
  const [totalHoy, setTotalHoy] = useState(0);
  const [totalSemana, setTotalSemana] = useState(0);
  const [totalSemanaAnterior, setTotalSemanaAnterior] = useState(0);
  
  const [totalAyer, setTotalAyer] = useState(0);
  const [montoTotal, setMontoTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPedidosHoy(await getPedidosHoy());
        setPedidosAyer(await getPedidosAyer());
        setPedidosSemana(await getPedidosSemana());
        setPedidosSemanaAnterior(await getPedidosSemanaAnterior());
        
        const pedidosMes = await getPedidosMes();
        
        setMontoTotal(pedidosMes.reduce((total, pedido) => total + pedido.total, 0));

        const data = await getPedidosPendientes();
        setPedidosPendientes(data.filter((pedido) => pedido.estado_pedido === "PENDIENTE"));
        setPedidosPreparados(data.filter((pedido) => pedido.estado_pedido === "PREPARADO"));
        setClientesConPedidosPendientes(Array.from(new Set(data.map((pedido) => pedido.nombre_cliente))));
        setClientesConPedidosPreparados(Array.from(new Set(data.filter((pedido) => pedido.estado_pedido === "PREPARADO").map((pedido) => pedido.nombre_cliente))));
        
        setDineroPendiente(data.filter((pedido) => pedido.estado_pago === "PENDIENTE").reduce((total, pedido) => total + pedido.total, 0));
      } catch (error) {
        console.log("Error al cargar los pedidos:", error);
      }
    };

    fetchData();
  }, []);

  const formatToCurrency = (amount) => {
    return amount.toLocaleString("en-AR", {
      style: "currency",
      currency: "ARS",
    });
  };

  /*useEffect(() => {
    setTotalHoy(pedidosHoy.reduce((total, pedido) => total + pedido.total, 0));
  }, [pedidosHoy]);*/
  useEffect(() => {
    if (Array.isArray(pedidosHoy)) {
      setTotalHoy(pedidosHoy.reduce((total, pedido) => total + pedido.total, 0));
    }
  }, [pedidosHoy]);

  useEffect(() => {
    if (Array.isArray(pedidosAyer)) {
    setTotalAyer(pedidosAyer.reduce((total, pedido) => total + pedido.total, 0));
    }
  }, [pedidosAyer]);

  useEffect(() => {
    if (Array.isArray(pedidosSemana)) {
    setTotalSemana(pedidosSemana.reduce((total, pedido) => total + pedido.total, 0));
    }
  }, [pedidosSemana]);

  useEffect(() => {
    if (Array.isArray(pedidosSemanaAnterior)) {
    setTotalSemanaAnterior(pedidosSemanaAnterior.reduce((total, pedido) => total + pedido.total, 0));
    }
  }, [pedidosSemanaAnterior]);

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
              Cant. Pedidos hoy 
            </Typography>
            <Typography variant="h4">{pedidosHoy.length}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total de hoy 
            </Typography>
            <Typography variant="h4">{formatToCurrency(totalHoy)}</Typography>
          </CardContent>
        </Card>
      </Grid>        
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cant. Pedidos ayer
            </Typography>
            <Typography variant="h4">{pedidosAyer.length}</Typography>
          </CardContent>
        </Card>
      </Grid>       
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total de ayer
            </Typography>
            <Typography variant="h4">{formatToCurrency(totalAyer)}</Typography>
          </CardContent>
        </Card>
      </Grid> 
      <Grid item xs={12} md={6}>        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cant. esta semana
            </Typography>
            <Typography variant="h4">{pedidosSemana.length}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total esta semana
            </Typography>
            <Typography variant="h4">{formatToCurrency(totalSemana)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cant.  semana anterior
            </Typography>
            <Typography variant="h4">{pedidosSemanaAnterior.length}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total semana anterior
            </Typography>
            <Typography variant="h4">{formatToCurrency(totalSemanaAnterior)}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dinero pendiente de cobro
            </Typography>
            <Typography variant="h4">${dineroPendiente ? formatToCurrency(dineroPendiente) : 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monto total de pedidos del mes
            </Typography>
            <Typography variant="h4">{montoTotal ? formatToCurrency(montoTotal) : 0 }</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
