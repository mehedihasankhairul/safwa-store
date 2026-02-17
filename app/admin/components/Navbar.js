import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Chip } from "@mui/material";
import { Menu, Notifications } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import useAuthStore from "../../../store/authStore";
import { usePathname } from "next/navigation";

const drawerWidth = 260;

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/books": "Books Inventory",
  "/admin/orders": "Orders Management",
  "/admin/invoices": "Invoices",
  "/admin/analytics": "Sales Analytics",
};

const Navbar = ({ toggleSidebar }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useAuthStore();
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "Admin Dashboard";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
        ml: isMobile ? 0 : `${drawerWidth}px`,
        bgcolor: "white",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar} sx={{ color: "#333" }}>
              <Menu />
            </IconButton>
          )}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1.1rem" }}>
              {pageTitle}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Chip
                label={user.role === "admin" ? "Admin" : "User"}
                size="small"
                sx={{
                  bgcolor: user.role === "admin" ? "#667eea15" : "#f0f0f0",
                  color: user.role === "admin" ? "#667eea" : "#666",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  height: 24
                }}
              />
              <Avatar sx={{
                width: 34, height: 34,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontSize: "0.8rem",
                fontWeight: 700
              }}>
                {user.name?.charAt(0)?.toUpperCase() || "A"}
              </Avatar>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
