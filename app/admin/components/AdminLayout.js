"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Box } from "@mui/material";

const drawerWidth = 260;

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f8f9fc" }}>
      <Sidebar mobileOpen={mobileOpen} toggleDrawer={() => setMobileOpen(!mobileOpen)} />

      <Box sx={{ flexGrow: 1, ml: { sm: `${drawerWidth}px` }, mt: "64px", p: { xs: 2, md: 3 } }}>
        <Navbar toggleSidebar={() => setMobileOpen(!mobileOpen)} />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
