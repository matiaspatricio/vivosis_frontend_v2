import React, { useState } from "react";
import { Typography, TextField, Button, Grid, Link, Paper, Avatar, Alert } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://vivosis-back-v2.vercel.app/api/auth/login", {
        email,
        password,
      });

      const { token } = response.data;
      const { username } = response.data.user;
      
      localStorage.setItem('token', token); // Guardar el token en el localStorage
      localStorage.setItem('username',username)
      //Cookies.set('token', token, { expires: 7 }); // La cookie expirará después de 7 días
      //const token = Cookies.get('token'); // Obtener el token de la cookie

      // Mostrar mensaje de éxito
      setLoginSuccess(true);

      // Redireccionar al usuario al "/" después de 2 segundos
      setTimeout(() => {
        window.location.reload(); // Refrescar la página después de 2 segundos
      }, 2000);
    } catch (error) {
      console.log("Error en el inicio de sesión:", error);
    }
  };  
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: "2rem", marginTop: "2rem" }}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Avatar sx={{ backgroundColor: "#f50057" }}>
                <LockOutlinedIcon />
              </Avatar>
            </Grid>
            <Grid item>
              <Typography component="h1" variant="h5">
                Log in
              </Typography>
            </Grid>
            {loginSuccess && (
              <Grid item xs={12}>
                <Alert severity="success" sx={{ marginBottom: "1rem" }}>
                  Login exitoso. Redireccionando...
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <form onSubmit={handleLogin}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: "1rem" }}
                >
                  Sign In
                </Button>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AuthForm;
