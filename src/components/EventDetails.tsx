import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ParticipateModal from "../views/CreateParticipateModal";

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
  tx_id: string;
  nome: string;
}

function formatValue(value: number, peopleCount: number) {
  const perPersonValue = (value / peopleCount).toFixed(2);
  return `R$ ${perPersonValue}`;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onBack }) => {
  const theme = useTheme();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [playersMissing, setPlayersMissing] = useState<number>(
    event.people_count
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isParticipateModalOpen, setIsParticipateModalOpen] =
    useState<boolean>(false);

  const openParticipateModal = () => {
    setIsParticipateModalOpen(true);
  };

  const closeParticipateModal = () => {
    setIsParticipateModalOpen(false);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL_PROD}/event/${event.id}/participants`
      )
      .then((response) => {
        setParticipants(response.data.participants);
        setPlayersMissing(
          event.people_count - response.data.participants.length
        );
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [event.id, event.people_count]);

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
        <IconButton
          onClick={handleClick}
          sx={{
            position: "absolute",
            top: theme.spacing(1),
            right: theme.spacing(2),
          }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Editar</MenuItem>
          <MenuItem onClick={handleClose}>Apagar</MenuItem>
        </Menu>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Lista de Confirmados
        </Typography>
        <Paper
          elevation={3}
          sx={{ height: "calc(100vh - 500px)", overflow: "auto" }}
        >
          <List>
            {participants.map((participant, index) => (
              <ListItem key={participant.tx_id}>
                <ListItemText primary={`${index + 1}. ${participant.nome}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
        {playersMissing > 0 && (
          <Typography
            variant="subtitle1"
            sx={{ marginTop: theme.spacing(1), textAlign: "left" }}
          >
            Faltam {playersMissing} jogadores.
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
        <Typography variant="subtitle1" gutterBottom component="div">
          <b style={{ fontWeight: "bold" }}>Valor por pessoa:</b>{" "}
          <span>{formatValue(event.value, event.people_count)}</span>
        </Typography>

        <Typography variant="subtitle1" gutterBottom component="div">
          <b style={{ fontWeight: "bold" }}>Endereço:</b>{" "}
          <span>{event.address}</span>
        </Typography>

        <Typography variant="subtitle1" gutterBottom component="div">
          <b style={{ fontWeight: "bold" }}>Data:</b>{" "}
          <span>{new Date(event.date).toLocaleDateString("pt-BR")}</span>
        </Typography>

        <Typography variant="subtitle1" gutterBottom component="div">
          <b style={{ fontWeight: "bold" }}>Quantidade de Pessoas:</b>{" "}
          <span>{event.people_count}</span>
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        container
        justifyContent="center"
        sx={{ position: "fixed", bottom: theme.spacing(2), left: 0, right: 0 }}
      >
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "fit-content", padding: theme.spacing(1, 4) }}
          onClick={openParticipateModal}
        >
          Participar!
        </Button>
      </Grid>
      <ParticipateModal
        isOpen={isParticipateModalOpen}
        closeModal={closeParticipateModal}
        eventId={event.id}
      />
    </Grid>
  );
};

export default EventDetails;
