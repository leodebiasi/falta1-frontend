import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

interface EventDetailsProps {
  event: {
    title: string;
    date: string;
    description: string;
  };
  backToList: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, backToList }) => {
  return (
    <Box display="flex" flexDirection="column" padding={3}>
      <Box display="flex" justifyContent="flex-start" alignItems="center" m={2}>
        <Button
          startIcon={<ArrowBackIcon color="inherit" />}
          onClick={backToList}
          variant="contained"
          color="secondary"
          style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}
        >
          Voltar
        </Button>
      </Box>
      <Typography variant="h4" marginBottom={2}>
        {event.title}
      </Typography>
      <Typography variant="subtitle1" marginBottom={2}>
        {event.date}
      </Typography>
      <Typography variant="body1" marginBottom={3}>
        {event.description}
      </Typography>
    </Box>
  );
};

export default EventDetails;
