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
import React, { useState } from "react";
import EventList, { AppEvent, fetchEvents } from "../components/EventList";
import CreateEventModal from "./CreateEventModal";

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

export default function HomePage() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const refreshEvents = async () => {
    const newEvents = await fetchEvents();
    if (newEvents) {
      setEvents(newEvents);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const closeModal = () => {
    setIsModalOpen(false);
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
            <img
              src="/falta1_logo.png"
              alt="Logo"
              style={{ height: "auto", width: "700px" }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mt: 2, mb: 1, ml: 2 }}
            >
              Conectamos Pessoas e esportes
            </Typography>
            <Button
              color="primary"
              variant="contained"
              sx={{ fontWeight: "bold", ml: 2, mt: 4 }}
              onClick={() => setIsModalOpen(true)}
            >
              Criar evento
            </Button>
            <CreateEventModal
              isOpen={isModalOpen}
              closeModal={closeModal}
              refreshEvents={refreshEvents}
            />
          </Grid>

          {/* Lado direito: Listagem de Eventos */}
          <Grid item xs={12} md={6} mb={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, mt: 2 }}>
              Eventos
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
            >
              <EventList events={events} setEvents={setEvents} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
