import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,  // Use ListItemButton for clickable items
} from "@mui/material";
import { Dashboard, LibraryBooks, ShoppingCart, ExitToApp, Menu, BarChart } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaFileInvoice } from "react-icons/fa";

const drawerWidth = 240; // Sidebar width

const Sidebar = ({ mobileOpen, toggleDrawer }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUser(null);
    if (user === null) {
      router.push("/");
    }
    alert("You have been logged out.");
  };

  const sidebarContent = (
    <List>
      <ListItemButton onClick={() => router.push("/admin")}>
        <ListItemIcon>
          <Dashboard />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton onClick={() => router.push("/admin/books")}>
        <ListItemIcon>
          <LibraryBooks />
        </ListItemIcon>
        <ListItemText primary="Books Inventory" />
      </ListItemButton>

      <ListItemButton onClick={() => router.push("/admin/orders")}>
        <ListItemIcon>
          <ShoppingCart />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItemButton>

      <ListItemButton onClick={() => router.push("/admin/invoices")}>
        <ListItemIcon>
          <FaFileInvoice />
        </ListItemIcon>
        <ListItemText primary="Invoices" />
      </ListItemButton>

      <ListItem disablePadding>
        <ListItemButton component={Link} href="/admin/analytics">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText primary="Sales Analytics" />
        </ListItemButton>
      </ListItem>

      <Divider />

      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );

  return (
    <>
      {/* Mobile Sidebar (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: "block", sm: "none" }, // Only show on mobile
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Sidebar (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" }, // Hide on mobile
          "& .MuiDrawer-paper": { width: drawerWidth }
        }}
        open
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
