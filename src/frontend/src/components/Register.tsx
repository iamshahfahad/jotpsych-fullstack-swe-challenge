import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [motto, setMotto] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // State for file input
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("motto", motto);
    if (avatarFile) {
      formData.append("avatar", avatarFile); // Append avatar file to FormData
    }

    try {
      const response = await fetch("http://localhost:3002/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Registration successful");
        setIsSuccess(true);
        if (data.token) {
          localStorage.setItem("token", data.token); // Save the login token
        }
      } else {
        setMessage(data.message || "Registration failed");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("An error occurred during registration");
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
            Register
          </Typography>
          <form onSubmit={handleRegister} style={{ width: "100%" }}>
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputLabelProps={{
                  style: { color: "white" },
                }}
                InputProps={{
                  style: { color: "white" },
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
                  style: { color: "white" },
                }}
                InputProps={{
                  style: { color: "white" },
                }}
            />
            <TextField
                label="Motto"
                variant="outlined"
                fullWidth
                margin="normal"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                InputLabelProps={{
                  style: { color: "white" },
                }}
                InputProps={{
                  style: { color: "white" },
                }}
            />
            {/* File input for Avatar */}
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    setAvatarFile(file);
                  }
                }}
                style={{ marginTop: "1rem", color: "white" }}
            />
            <Button
                type="submit"
                variant="contained"
                fullWidth
                style={{ marginTop: "1rem", backgroundColor: "white", color: "darkblue" }}
            >
              Register
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

export default Register;
