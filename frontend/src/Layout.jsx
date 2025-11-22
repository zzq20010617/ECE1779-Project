import ResAppBar from "./AppBar.jsx";
import { Outlet } from "react-router-dom";
import { Toolbar, Box } from "@mui/material";

export default function Layout() {
  return (
    <>
      <ResAppBar />
      <Toolbar /> {/* App Bar */}

      <Box sx={{ p: 3 }}>
        <Outlet />   {/* Content */}
      </Box>
    </>
  );
}