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
        
        setPedidosHoy( await getPedidosHoy());
        setTotalHoy(pedidosHoy.reduce((total, pedido) => total + pedido.total, 0));        

        setPedidosAyer( await getPedidosAyer());        
        setTotalAyer(pedidosAyer.reduce((total, pedido) => total + pedido.total, 0));

        setPedidosSemana( await getPedidosSemana());
        setTotalSemana(pedidosSemana.reduce((total, pedido) => total + pedido.total, 0));
        

        setPedidosSemanaAnterior( await getPedidosSemanaAnterior());
        setTotalSemanaAnterior(pedidosSemanaAnterior.reduce((total, pedido) => total + pedido.total, 0));
        console.log("Pedidos de la semana:", pedidosSemanaAnterior)
        console.log("Total de la semana:", totalSemanaAnterior)

        const pedidosMes = await getPedidosMes();
         setMontoTotal(pedidosMes.reduce((total, pedido) => {
          //console.log("Pedido:", pedido); esto borrarlo
          //console.log("Total acumulado:", total);
          //console.log("Total del pedido:", pedido.total);oka
          return total + pedido.total;
        }, 0));        

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
            <Typography variant="h4">{pedidosHoy.length ? pedidosHoy.length : 0 }</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total de hoy 
            </Typography>
            <Typography variant="h4">${totalHoy}</Typography>
          </CardContent>
        </Card>
      </Grid>        
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cant. Pedidos ayer
            </Typography>
            <Typography variant="h4">{pedidosAyer.length ? pedidosAyer.length : 0 }</Typography>
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
              Cant. esta semana
            </Typography>
            <Typography variant="h4">{pedidosSemana.length ? pedidosSemana.length : 0 }</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total esta semana
            </Typography>
            <Typography variant="h4">${totalSemana ? totalSemana : 0 }</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cant.  semana anterior
            </Typography>
            <Typography variant="h4">{pedidosSemanaAnterior.length ? pedidosSemanaAnterior.length : 0 }</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total semana anterior
            </Typography>
            <Typography variant="h4">${totalSemanaAnterior ? totalSemanaAnterior : 0 }</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Monto total de pedidos del mes
      </Typography>
      <Typography variant="h4">${montoTotal}</Typography>
    </CardContent>
  </Card>
</Grid>

    </Grid>
  );
};

export default Dashboard;
