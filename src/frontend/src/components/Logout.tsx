import React from "react";

function Logout() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("You have been logged out.");
        window.location.href = "/";
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default Logout;
