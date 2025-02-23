import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";

const Navbar = ({ toggleSidebar }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <AppBar position="fixed" sx={{ width: isMobile ? "100%" : `calc(100% - 240px)`, ml: isMobile ? 0 : "240px" }}>
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
            <Menu />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
