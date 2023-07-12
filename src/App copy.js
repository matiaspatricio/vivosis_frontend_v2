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
            <MenuIcon />
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
          <ListItem button component={Link} to="/VerProductos" onClick={handleDrawerClose}>
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

          <ListItem button component={Link} to="/ActualizaMasivaPedidos" onClick={handleDrawerClose}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="ACTUALIZAR PEDIDOS DE CLIENTES" />
          </ListItem>

          <ListItem button component={Link} to="/EnviosClientes" onClick={handleDrawerClose}>
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
        <Route path="/verClientes" element={<VerClientes />} />
        <Route path="/VerProductos" element={<VerProductos />} />
        <Route path="/VerIngresos" element={<VerIngresos />} />
        <Route path="/VerPedidos" element={<VerPedidos />} />
        <Route path="/ModificarCliente/:id" element={<ModificarCliente />} />
        <Route path="/ModificarProducto/:id" element={<ModificarProducto />} />
        <Route path="/ModificarIngreso/:id" element={<ModificarIngreso />} />
        <Route path="/ModificarPedido/:id" element={<ModificarPedido />} />
        <Route path="/CrearCliente/" element={<CrearCliente />} />
        <Route path="/CrearProducto/" element={<CrearProducto />} />
        <Route path="/CrearIngreso/" element={<CrearIngreso />} />
        <Route path="/CrearPedido/" element={<CrearPedido />} />
        <Route path="/ActualizaMasivaPedidos/" element={<ActualizaMasivaPedidos />} />
        <Route path="/EnviosClientes/" element={<EnviosClientes />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;


//////////////


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
import { AppBar, Toolbar, Button } from '@mui/material';
import ActualizaMasivaPedidos from './components/ActualizaMasivaPedidos';
import EnviosClientes from './components/EnviosClientes';
import Stack from '@mui/material/Stack';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useEffect } from 'react';



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
  
  useEffect(() => {
    document.title = "Sistema de Pedidos";
  }, []);

  return (
    
    <Router>
      <AppBar position="static">
        <Toolbar>
        <Stack direction="row" spacing={2}>
          <Button  variant='outlined' color="inherit" component={Link} to="/" style={{ padding: 5 }}>
            INICIO
          </Button>
          <Button  variant='outlined' color="inherit" component={Link} to="/verclientes" style={{ padding: 5 }}>
            CLIENTES
          </Button>
          <Button  variant='outlined' color="inherit" component={Link} to="/VerProductos" style={{ padding: 5 }}>
            PRODUCTOS
          </Button>
          <Button  variant='outlined' color="inherit" component={Link} to="/veringresos" style={{ padding: 5 }}>
            INGRESOS
          </Button>
          <Button  variant='outlined' color="inherit" component={Link} to="/verpedidos" style={{ padding: 5 }}>
            PEDIDOS
          </Button>    
          <Button variant='outlined' color="inherit" component={Link} to="/ActualizaMasivaPedidos" style={{ padding: 5 }}>
          Actualizar Pedidos de Clientes
          </Button>             
          <Button variant='outlined' color="inherit" component={Link} to="/EnviosClientes" style={{ padding: 5 }}>
          Envios Whatsapp 
          </Button>  
          
        </Stack>      
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verClientes" element={<VerClientes />} />
        <Route path="/VerProductos" element={<VerProductos />} />
        <Route path="/VerIngresos" element={<VerIngresos />} />
        <Route path="/VerPedidos" element={<VerPedidos />} />
        <Route path="/ModificarCliente/:id" element={<ModificarCliente />} />
        <Route path="/ModificarProducto/:id" element={<ModificarProducto />} />
        <Route path="/ModificarIngreso/:id" element={<ModificarIngreso />} />
        <Route path="/ModificarPedido/:id" element={<ModificarPedido />} />
        <Route path="/CrearCliente/" element={<CrearCliente />} />
        <Route path="/CrearProducto/" element={<CrearProducto />} />
        <Route path="/CrearIngreso/" element={<CrearIngreso />} />
        <Route path="/CrearPedido/" element={<CrearPedido />} />
        <Route path="/ActualizaMasivaPedidos/" element={<ActualizaMasivaPedidos />} />        
        <Route path="/EnviosClientes/" element={<EnviosClientes />} />
        
        
        
        
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
