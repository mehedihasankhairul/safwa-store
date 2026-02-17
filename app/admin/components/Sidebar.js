"use client";
import { useState } from "react";
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import { Dashboard, LibraryBooks, ShoppingCart, ExitToApp, BarChart } from "@mui/icons-material";
import { FaFileInvoice } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "../../../store/authStore";

const drawerWidth = 260;

const menuItems = [
  { label: "Dashboard", icon: <Dashboard />, path: "/admin" },
  { label: "Books Inventory", icon: <LibraryBooks />, path: "/admin/books" },
  { label: "Orders", icon: <ShoppingCart />, path: "/admin/orders" },
  { label: "Invoices", icon: <FaFileInvoice size={20} />, path: "/admin/invoices" },
  { label: "Sales Analytics", icon: <BarChart />, path: "/admin/analytics" },
];

const Sidebar = ({ mobileOpen, toggleDrawer }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (path) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  const sidebarContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#1a1a2e" }}>
      {/* Brand Header */}
      <Box sx={{ px: 3, py: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: "white", letterSpacing: -0.5 }}>
          🏪 Safwa
        </Typography>
        <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 2, mt: 0.3 }}>
          Admin Panel
        </Typography>
      </Box>

      {/* Admin User Info */}
      {user && (
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{
              width: 36, height: 36,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontSize: "0.85rem",
              fontWeight: 700
            }}>
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "white", lineHeight: 1.2 }}>
                {user.name || "Admin"}
              </Typography>
              <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>
                {user.role === "admin" ? "Administrator" : "User"}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 1.5 }}>
        <Typography sx={{ px: 3, py: 1, fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>
          Navigation
        </Typography>
        <List sx={{ px: 1.5 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItemButton
                key={item.label}
                onClick={() => {
                  router.push(item.path);
                  if (mobileOpen) toggleDrawer();
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.2,
                  px: 2,
                  bgcolor: active ? "rgba(102, 126, 234, 0.15)" : "transparent",
                  borderLeft: active ? "3px solid #667eea" : "3px solid transparent",
                  "&:hover": {
                    bgcolor: active ? "rgba(102, 126, 234, 0.2)" : "rgba(255,255,255,0.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 36,
                  color: active ? "#667eea" : "rgba(255,255,255,0.5)",
                  "& svg": { fontSize: "1.2rem" }
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.85rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? "#667eea" : "rgba(255,255,255,0.7)",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Logout */}
      <Box sx={{ p: 1.5, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 2,
            "&:hover": { bgcolor: "rgba(244, 67, 54, 0.1)" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "rgba(255,255,255,0.4)" }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.5)",
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, border: "none" },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, border: "none" },
        }}
        open
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
