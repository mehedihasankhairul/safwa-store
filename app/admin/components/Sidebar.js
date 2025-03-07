import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
} from "@mui/material";
import { Dashboard, LibraryBooks, ShoppingCart, ExitToApp, Menu, BarChart } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import { FaFileInvoice, FaPaperclip } from "react-icons/fa";

const drawerWidth = 240; // Sidebar width

const Sidebar = ({ mobileOpen, toggleDrawer }) => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)"); // Detect mobile screens
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
      <ListItem button onClick={() => router.push("/admin")}>
        <ListItemIcon>
          <Dashboard />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>

      <ListItem button onClick={() => router.push("/admin/books")}>
        <ListItemIcon>
          <LibraryBooks />
        </ListItemIcon>
        <ListItemText primary="Books Inventory" />
      </ListItem>

      <ListItem button onClick={() => router.push("/admin/orders")}>
        <ListItemIcon>
          <ShoppingCart />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItem>
      <ListItem button onClick={() => router.push("/admin/invoices")}>
        <ListItemIcon>
          <FaFileInvoice />
        </ListItemIcon>
        <ListItemText primary="Invoices" />
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton component={Link} href="/admin/analytics">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText primary="Sales Analytics" />
        </ListItemButton>
      </ListItem>

      <Divider />

      <ListItem button onClick={() => console.log("Logout function here")}>
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText onClick={handleLogout} primary="Logout" />
      </ListItem>
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
