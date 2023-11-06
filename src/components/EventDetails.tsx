import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface EventDetailsProps {
  event: EventDetails;
  onBack: () => void;
}

interface EventDetails {
  value: number;
  address: string;
  date: string;
  people_count: number;
}

interface Participant {
  id: string | number;
  name: string;
}

const EventDetails = ({ event, onBack }: EventDetailsProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    axios
      .get("/get-participants")
      .then((response) => {
        setParticipants(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  if (!event) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3}>
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
        <Typography variant="subtitle1">
          Value per person: R$ {event.value.toFixed(2)}
        </Typography>
        <Typography variant="subtitle1">Address: {event.address}</Typography>
        <Typography variant="subtitle1">Date: {event.date}</Typography>
        <Typography variant="subtitle1">
          People Count: {event.people_count}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default EventDetails;
