import { Box, Typography } from "@mui/material";
import React from "react";

const Header: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="secondary.main"
      height={100}
      mb={4}
    >
      <Typography variant="h3" color="textPrimary">
        FALTA1
      </Typography>
    </Box>
  );
};

export default Header;
