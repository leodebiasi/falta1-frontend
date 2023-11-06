import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface EventDetailsProps {
  event: EventDetailsData;
  onBack: () => void;
}

interface EventDetailsData {
  id: number;
  value: number;
  address: string;
  date: string;
  people_count: number;
}

interface Participant {
  id: string | number;
  name: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onBack }) => {
  const theme = useTheme();
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL_PROD}/event/${event.id}/participants`
      )
      .then((response) => setParticipants(response.data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  if (!event) {
    return null;
  }

  return (
    <Grid container spacing={2} sx={{ padding: theme.spacing(2) }}>
      <Grid
        item
        xs={12}
        sx={{ position: "relative", paddingBottom: theme.spacing(4) }}
      >
        <IconButton
          onClick={onBack}
          sx={{
            position: "absolute",
            top: theme.spacing(1),
            left: theme.spacing(2),
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} sx={{ maxHeight: 300, overflow: "auto" }}>
          <List>
            {participants.map((participant) => (
              <ListItem key={participant.id}>
                <ListItemText primary={participant.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle1" gutterBottom>
          Valor por pessoa: R$ {event.value.toFixed(2)}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Endereço: {event.address}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Data: {new Date(event.date).toLocaleDateString("pt-BR")}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Quantidade de Pessoas: {event.people_count}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default EventDetails;
