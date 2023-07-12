import './App.css';
import VerClientes from './components/VerClientes';
import VerProductos from './components/VerProductos';
import VerIngresos from './components/VerIngresos';
import VerPedidos from './components/VerPedidos';
import ModificarCliente from './components/ModificarCliente';
import ModificarProducto from './components/ModificarProducto';
import ModificarIngreso from './components/ModificarIngreso';
import ModificarPedido from './components/ModificarPedido';
import CrearCliente from './components/CrearCliente';
import CrearProducto from './components/CrearProducto';
import CrearIngreso from './components/CrearIngreso';
import CrearPedido from './components/CrearPedido';
import ActualizaMasivaPedidos from './components/ActualizaMasivaPedidos';
import EnviosClientes from './components/EnviosClientes';
import Stack from '@mui/material/Stack';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
} from '@mui/material';
//import MenuIcon from '@mui/icons-material/Menu';
import MenuSharpIcon from '@mui/icons-material/MenuSharp';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Inicio</h2>
      <p>Sistema de pedidos para vivos.</p>
    </div>
  );
}

function NoMatch() {
  return (
    <div style={{ padding: 20 }}>
      <h2>404: Page Not Found</h2>
      <p>Pagina no encontrada.</p>
    </div>
  );
}

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleServicesToggle = () => {
    setServicesOpen(!servicesOpen);
  };

  useEffect(() => {
    document.title = "Sistema de Pedidos";
  }, []);

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
            <MenuSharpIcon/>
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Menu
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
        <List style={{ width: 350 }}>
          <ListItem button component={Link} to="/" onClick={handleDrawerClose}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="INICIO" />
          </ListItem>
          <ListItem button component={Link} to="/verclientes" onClick={handleDrawerClose}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="CLIENTES" />
          </ListItem>
          <ListItem button component={Link} to="/verproductos" onClick={handleDrawerClose}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="PRODUCTOS" />
          </ListItem>
          <ListItem button onClick={handleServicesToggle}>
            <ListItemIcon>
              <MonetizationOnIcon />
            </ListItemIcon>
            <ListItemText primary="INGRESOS" />
            {servicesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={servicesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button component={Link} to="/veringresos" onClick={handleDrawerClose} style={{ paddingLeft: 32 }}>
                <ListItemIcon>
                  <MonetizationOnIcon />
                </ListItemIcon>
                <ListItemText primary="INGRESOS" />
              </ListItem>
              {/* Agrega más submenús aquí */}
            </List>
          </Collapse>
          <ListItem button component={Link} to="/verpedidos" onClick={handleDrawerClose}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="PEDIDOS" />
          </ListItem>

          <ListItem button component={Link} to="/actualizamasivapedidos" onClick={handleDrawerClose}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="ACTUALIZAR PEDIDOS DE CLIENTES" />
          </ListItem>

          <ListItem button component={Link} to="/enviosclientes" onClick={handleDrawerClose}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="ENVIOS WHATSAPP" />
          </ListItem>
          {/* Agrega más elementos de menú aquí */}
        </List>
      </Drawer>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verclientes" element={<VerClientes />} />
        <Route path="/Verproductos" element={<VerProductos />} />
        <Route path="/Veringresos" element={<VerIngresos />} />
        <Route path="/verpedidos" element={<VerPedidos />} />
        <Route path="/modificarcliente/:id" element={<ModificarCliente />} />
        <Route path="/modificarproducto/:id" element={<ModificarProducto />} />
        <Route path="/modificaringreso/:id" element={<ModificarIngreso />} />
        <Route path="/modificarpedido/:id" element={<ModificarPedido />} />
        <Route path="/crearcliente/" element={<CrearCliente />} />
        <Route path="/crearproducto/" element={<CrearProducto />} />
        <Route path="/crearingreso/" element={<CrearIngreso />} />
        <Route path="/crearpedido/" element={<CrearPedido />} />
        <Route path="/actualizamasivapedidos/" element={<ActualizaMasivaPedidos />} />
        <Route path="/enviosclientes/" element={<EnviosClientes />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
