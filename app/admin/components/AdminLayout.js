"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Box } from "@mui/material";

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex flex-col" }}>
      <Sidebar mobileOpen={mobileOpen} toggleDrawer={() => setMobileOpen(!mobileOpen)} />

      <Box sx={{ flexGrow: 1, ml: { sm: "240px" }, mt: "64px", p: 2 }}>
        <Navbar toggleSidebar={() => setMobileOpen(!mobileOpen)} />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
