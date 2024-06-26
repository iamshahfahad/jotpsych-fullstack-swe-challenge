import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3002/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      if (data.token) {
        localStorage.setItem("token", data.token); // Saving the login token in local storage to be accessed by the app
      }
      setMessage("Login successful");
      setIsSuccess(true);
    } else {
      setMessage(data.message);
      setIsSuccess(false);
    }
  };

  return (
      <Container maxWidth="sm">
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt={5}
            p={3}
            border={1}
            borderRadius={2}
            borderColor="grey.300"
            sx={{
              background: "linear-gradient(to bottom right, skyblue, darkblue)",
              color: "white",
            }}
        >
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputLabelProps={{
                  style: { color: 'white' },
                }}
                InputProps={{
                  style: { color: 'white' },
                }}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{
                  style: { color: 'white' },
                }}
                InputProps={{
                  style: { color: 'white' },
                }}
            />
            <Button
                type="submit"
                variant="contained"
                fullWidth
                style={{ marginTop: "1rem", backgroundColor: 'white', color: 'darkblue' }}
            >
              Login
            </Button>
          </form>
          {message && (
              <Alert severity={isSuccess ? "success" : "error"} style={{ marginTop: "1rem" }}>
                {message}
              </Alert>
          )}
        </Box>
      </Container>
  );
}

export default Login;
