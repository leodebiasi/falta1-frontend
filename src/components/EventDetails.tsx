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
      <Typography variant="h4" marginBottom={2}>
        {event.title}
      </Typography>
      <Typography variant="subtitle1" marginBottom={2}>
        {event.date}
      </Typography>
      <Typography variant="body1" marginBottom={3}>
        {event.description}
      </Typography>

      <Button variant="contained" onClick={backToList}>
        Voltar para a lista
      </Button>
    </Box>
  );
};

export default EventDetails;
