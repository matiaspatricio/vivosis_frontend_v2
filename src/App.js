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
import CreateIcon from '@mui/icons-material/Create';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Register from './components/Register';
import Logout from './components/Logout';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
} from '@mui/material';

import MenuSharpIcon from '@mui/icons-material/MenuSharp';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VerPedidosHistorico from './components/VerPedidosHistorico';

function NoMatch() {
  return (
    <div style={{ padding: 20 }}>
      <h2>404: Page Not Found</h2>
      <p>Pagina no encontrada.</p>
    </div>
  );
}

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [clientesOpen, setClientesOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleServicesToggle = () => {
    setServicesOpen(!servicesOpen);
  };

  const handleClientesToggle = () => {
    setClientesOpen(!clientesOpen);
  };

  const handleProductosToggle = () => {
    setProductosOpen(!productosOpen);
  };

  useEffect(() => {
    document.title = "Sistema de Pedidos";
    const token = localStorage.getItem('token');

    if (token) {
      // Si se encuentra un token almacenado, establece el estado de autenticación como logueado
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    setAuthToken(null);
    setIsAuthenticated(false);
  };

  const PrivateRoute = ({ element, ...props }) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
            <MenuSharpIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Menu
          </Typography>
          <div>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/logout" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </div>
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
          <ListItem button onClick={handleClientesToggle}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="CLIENTES" />
            {clientesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={clientesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              

              <ListItem
                button
                component={Link}
                to="/crearcliente"
                onClick={handleDrawerClose}
                style={{ paddingLeft: 32 }}
              >
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary="CREAR " />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/verclientes"
                onClick={handleDrawerClose}
                style={{ paddingLeft: 32 }}
              >
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="VISUALIZAR" />
              </ListItem>

              {/* Agrega más submenús para CLIENTES aquí */}
            </List>
          </Collapse>
          <ListItem button onClick={handleProductosToggle}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="PRODUCTOS" />
            {productosOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={productosOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="/crearproducto"
                onClick={handleDrawerClose}
                style={{ paddingLeft: 32 }}
              >
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary="CREAR" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/verproductos"
                onClick={handleDrawerClose}
                style={{ paddingLeft: 32 }}
              >
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="VISUALIZAR" />
              </ListItem>

              {/* Agrega más submenús para PRODUCTOS aquí */}
            </List>
          </Collapse>
          <ListItem button onClick={handleServicesToggle}>
            <ListItemIcon>
              <MonetizationOnIcon />
            </ListItemIcon>
            <ListItemText primary="PEDIDOS" />
            {servicesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={servicesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component={Link}
                to="/crearpedido"
                onClick={handleDrawerClose}
                style={{ paddingLeft: 32 }}
              >
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary="CREAR" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/verpedidos"
                onClick={handleDrawerClose}
                style={{ paddingLeft: 32 }}
              >
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="VISUALIZAR" />
              </ListItem>

              

              <ListItem
                button
                component={Link}
                to="/enviosclientes"
                onClick={handleDrawerClose}
                style={{ paddingLeft: 32 }}
              >
                <ListItemIcon>
                  <WhatsAppIcon />
                </ListItemIcon>
                <ListItemText primary="ENVIOS TOTALES WHATSAPP" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/verpedidoshistorico"
                onClick={handleDrawerClose}
                style={{ paddingLeft: 32 }}
              >
                <ListItemIcon>
                  <VisibilityIcon />
                </ListItemIcon>
                <ListItemText primary="HISTORICO (PEDIDOS)" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/actualizamasivapedidos"
                onClick={handleDrawerClose}
                style={{ paddingLeft: 32 }}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="ACTUALIZAR PEDIDOS DE CLIENTES" />
              </ListItem>

              
            </List>
          </Collapse>
          <ListItem button component={Link} to="/veringresos" onClick={handleDrawerClose}>
            <ListItemIcon>
              <LocalShippingIcon />
            </ListItemIcon>
            <ListItemText primary="INGRESOS" />
          </ListItem>

          {/* Agrega más elementos de menú aquí */}
        </List>
      </Drawer>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/verclientes" element={<PrivateRoute element={<VerClientes />} />} />
        <Route path="/crearcliente" element={<PrivateRoute element={<CrearCliente />} />} />
        <Route path="/verproductos" element={<PrivateRoute element={<VerProductos />} />} />
        <Route path="/crearproducto" element={<PrivateRoute element={<CrearProducto />} />} />
        <Route path="/veringresos" element={<PrivateRoute element={<VerIngresos />} />} />
        <Route path="/verpedidos" element={<PrivateRoute element={<VerPedidos />} />} />
        <Route path="/verpedidoshistorico" element={<PrivateRoute element={<VerPedidosHistorico />} />} />
        <Route path="/modificarcliente/:id" element={<PrivateRoute element={<ModificarCliente />} />} />
        <Route path="/modificarproducto/:id" element={<PrivateRoute element={<ModificarProducto />} />} />
        <Route path="/modificaringreso/:id" element={<PrivateRoute element={<ModificarIngreso />} />} />
        <Route path="/modificarpedido/:id" element={<PrivateRoute element={<ModificarPedido />} />} />
        <Route path="/crearcliente/" element={<PrivateRoute element={<CrearCliente />} />} />
        <Route path="/crearproducto/" element={<PrivateRoute element={<CrearProducto />} />} />
        <Route path="/crearingreso/" element={<PrivateRoute element={<CrearIngreso />} />} />
        <Route path="/crearpedido/" element={<PrivateRoute element={<CrearPedido />} />} />
        <Route
          path="/actualizamasivapedidos/"
          element={<PrivateRoute element={<ActualizaMasivaPedidos />} />}
        />
        <Route path="/enviosclientes/" element={<PrivateRoute element={<EnviosClientes />} />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route path="/logout" element={isAuthenticated ? <Logout /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
