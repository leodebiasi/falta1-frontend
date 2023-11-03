import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import EventDetails from "../components/EventDetails";
import EventList from "../components/EventList";
import CreateEventModal from "./CreateEventModal";
import ParticipateModal from "./CreateParticipateModal";

const HomePage = () => {
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [isParticipateModalOpen, setIsParticipateModalOpen] =
    useState<boolean>(false);

  const handleBackToList = () => {
    setViewDetails(false);
    setSelectedEvent(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openParticipateModal = () => {
    setIsParticipateModalOpen(true);
  };

  const closeParticipateModal = () => {
    setIsParticipateModalOpen(false);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setViewDetails(true);
  };

  return (
    <Container
      component="main"
      maxWidth="xl"
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f3f3f3",
      }}
    >
      <Grid container direction="column" style={{ height: "100%" }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="primary.main"
          height={100}
          mb={2}
          boxShadow={3}
        >
          <Typography variant="h3" color="textPrimary">
            FALTA1
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <TextField
            variant="outlined"
            placeholder="Buscar jogo"
            fullWidth
            sx={{ maxWidth: "70%" }}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>

        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          borderTop={1}
          borderRight={1}
          borderBottom={1}
          borderLeft={1}
          borderColor="grey.400"
          borderRadius="5px"
          mb={2}
          overflow="auto"
        >
          {!viewDetails ? (
            <EventList onEventClick={handleEventClick} />
          ) : (
            <EventDetails event={selectedEvent} backToList={handleBackToList} />
          )}
        </Box>
        <Box display="flex" justifyContent="center" mb={4}>
          {!viewDetails ? (
            <>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "30%" }}
                onClick={openModal}
              >
                Criar evento
              </Button>
              <CreateEventModal isOpen={isModalOpen} closeModal={closeModal} />
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: "30%" }}
                onClick={openParticipateModal}
              >
                Participar!
              </Button>
              <ParticipateModal
                isOpen={isParticipateModalOpen}
                closeModal={closeParticipateModal}
              />
            </>
          )}
        </Box>
      </Grid>
    </Container>
  );
};

export default HomePage;
