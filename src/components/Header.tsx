import { Box } from "@mui/material";
import React from "react";

const Header: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={100}
      mb={1}
    >
      <img
        src="/falta1_logo.png"
        alt="Logo"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      />
    </Box>
  );
};

export default Header;
