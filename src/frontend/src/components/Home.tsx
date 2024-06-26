import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout.tsx";

function Home() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await fetch("http://localhost:3002/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsername(data.username);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h2>Home</h2>
      {username ? (
        <p>Welcome, {username}!
          <br/>
          <Logout/>
          </p>
      ) : (
        <p>
          Please <Link to="/login">login</Link> or{" "}
          <Link to="/register">register</Link>.
        </p>
      )}
    </div>
  );
}

export default Home;
