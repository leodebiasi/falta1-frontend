import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import {
  AlertColor,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  Paper,
  SnackbarCloseReason,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ParticipateModal from "./CreateParticipateModal";

interface EventDetailsData {
  id: number;
  description: string;
  value: number;
  address: string;
  date: string;
  people_count: number;
}

interface Participant {
  tx_id: string;
  nome: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
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
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success" as AlertColor,
  });

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = (
    event?: SyntheticEvent<any, Event> | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL_PROD;

    axios
      .get(`${apiUrl}/get-event/${eventId}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => console.error("Error fetching event details: ", error));

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

  const handleDeleteEvent = () => {
    const userPassword = prompt(
      "Por favor, insira a senha para apagar o evento:"
    );
    if (userPassword) {
      axios
        .delete(
          `${process.env.REACT_APP_API_URL_PROD}/delete-event/${event.id}`,
          {
            data: { password: userPassword },
          }
        )
        .then(() => {
          showSnackbar("Evento apagado com sucesso.", "success");
          navigate(-1);
        })
        .catch((error) => {
          showSnackbar(
            "Erro ao apagar o evento: " + error.response.data.message,
            "warning"
          );
        });
    }
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          text: "Bora jogar? Falta 1!",
          url: window.location.href,
        })
        .then(() => {
          console.log("Compartilhamento bem-sucedido!");
        })
        .catch((error) => {
          console.log("Erro ao compartilhar", error);
        });
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          console.log("Link copiado para a área de transferência!");
        })
        .catch((error) => {
          console.log("Erro ao copiar o link", error);
        });
    }
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
        <IconButton
          color="secondary"
          onClick={handleBack}
          aria-label="Voltar"
          sx={{ position: "absolute", top: 16, left: 16, borderRadius: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Grid container spacing={3} sx={{ height: "100%", pt: 3 }}>
          <Grid item xs={12} md={6}>
            <Box fontWeight="fontWeightBold" sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h3" color="secondary" gutterBottom>
                Bora jogar?
              </Typography>
              <Box
                component="img"
                src="/image_detail.png"
                alt="Evento"
                sx={{ width: "100%", maxWidth: 400, borderRadius: 2 }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                my: 2,
              }}
            >
              <Typography variant="h4" color="primary" noWrap gutterBottom>
                {event.description}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{ borderRadius: 20, px: 3 }}
                onClick={openParticipateModal}
              >
                Participar!
              </Button>
            </Box>

            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <Box component="span" fontWeight="fontWeightBold">
                    Valor por pessoa:
                  </Box>{" "}
                  {formatValue(event.value, event.people_count)}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  <Box component="span" fontWeight="fontWeightBold">
                    Endereço:
                  </Box>{" "}
                  {event.address}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  <Box component="span" fontWeight="fontWeightBold">
                    Data:
                  </Box>{" "}
                  {new Date(event.date).toLocaleDateString("pt-BR")}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  <Box component="span" fontWeight="fontWeightBold">
                    Quantidade de Pessoas:
                  </Box>{" "}
                  {event.people_count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6" color="secondary" gutterBottom>
                Lista de jogadores
              </Typography>
              <IconButton
                color="error"
                onClick={handleDeleteEvent}
                aria-label="Apagar evento"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Paper
              elevation={3}
              sx={{ p: 2, borderRadius: 2, height: "calc(100% - 48px)" }}
            >
              <Box
                sx={{ overflow: "auto", maxHeight: "calc(100% - 48px)", pr: 2 }}
              >
                {participants.map((participant, index) => (
                  <Card key={participant.tx_id} sx={{ mb: 2 }}>
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "scale(1.02)",
                          transition: "transform 0.15s ease-in-out",
                          backgroundColor: "action.hover", // Um leve fundo ao passar o mouse.
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ minWidth: "2rem", textAlign: "right" }}
                      >
                        {index + 1}
                      </Typography>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ mx: 1.5 }}
                      />
                      <Typography variant="h6">{participant.nome}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
            <IconButton
              color="secondary"
              onClick={handleBack}
              aria-label="Voltar"
              sx={{ position: "absolute", top: 16, left: 16, borderRadius: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={handleShareClick}
              aria-label="Compartilhar"
              sx={{ position: "absolute", top: 16, left: 76, borderRadius: 2 }}
            >
              <ShareIcon />
            </IconButton>
          </Grid>
        </Grid>
        <ParticipateModal
          isOpen={isParticipateModalOpen}
          closeModal={closeParticipateModal}
          eventId={event.id}
        />
      </Container>
    </ThemeProvider>
  );
};

export default EventDetails;
