import {
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ParticipateModal from "./CreateParticipateModal";

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

const theme = createTheme({
  palette: {
    primary: {
      main: "#fc4e30",
    },
    secondary: {
      main: "#1a3d7c",
    },
    background: {
      default: "#f3f3f3",
    },
  },
});

function formatValue(value: number, peopleCount: number) {
  const perPersonValue = (value / peopleCount).toFixed(2);
  return `R$ ${perPersonValue}`;
}

const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetailsData | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isParticipateModalOpen, setIsParticipateModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL_PROD;

    // Carregar os detalhes do evento
    axios
      .get(`${apiUrl}/get-event/${eventId}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => console.error("Error fetching event details: ", error));

    // Carregar os participantes do evento
    axios
      .get(`${apiUrl}/event/${eventId}/participants`)
      .then((response) => {
        setParticipants(response.data.participants);
      })
      .catch((error) => console.error("Error fetching participants: ", error));
  }, [eventId]);

  if (!event) {
    return <div>Carregando...</div>; // ou qualquer outra mensagem de loading que você queira mostrar
  }

  const handleBack = () => {
    navigate(-1);
  };

  const openParticipateModal = () => {
    setIsParticipateModalOpen(true);
  };

  const closeParticipateModal = () => {
    setIsParticipateModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        component="main"
        maxWidth="xl"
        sx={{ height: "100vh", overflow: "hidden" }}
      >
        <Grid container spacing={1} sx={{ height: "100%" }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1, ml: 2 }}>
              Bora jogar?
            </Typography>
            <img
              src="/image_detail.png"
              alt="Logo"
              style={{ height: "auto", width: "400px" }}
            />
            <Button
              color="secondary"
              variant="contained"
              sx={{ fontWeight: "bold", ml: 2, mt: 4 }}
              onClick={openParticipateModal}
            >
              Participar!
            </Button>
            <ParticipateModal
              isOpen={isParticipateModalOpen}
              closeModal={closeParticipateModal}
              eventId={event.id}
            />
          </Grid>

          {/* Lado direito: Listagem de Eventos */}
          <Grid item xs={12} md={6} mb={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, mt: 2 }}>
              Lista de jogadores
            </Typography>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                backgroundColor: "#fff",
                mt: 2,
              }}
            ></Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default EventDetails;
