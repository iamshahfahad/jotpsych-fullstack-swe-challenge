import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Button, Avatar } from "@mui/material";

function Profile() {
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const response = await fetch("http://localhost:3002/profile", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setUserData(data);
                }
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
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
                {userData ? (
                    <>
                        <Avatar
                            alt={userData.avatarUrl}
                            src={userData.avatar_url}
                            sx={{ width: 80, height: 80, mb: 2 }}
                        />
                        <Typography variant="h5" gutterBottom>
                            {userData.username}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            "{userData.motto}"
                        </Typography>
                        <Box display="flex" justifyContent="space-between" width="100%" mt={4}>
                            <Button variant="contained" color="success" style={{ backgroundColor: 'lightgreen' }}>
                                Record (New) Motto
                            </Button>
                            <Button variant="contained" color="error" style={{ backgroundColor: 'lightcoral' }} onClick={handleLogout}>
                                Logout
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="h6">
                        Loading...
                    </Typography>
                )}
            </Box>
        </Container>
    );
}

export default Profile;
