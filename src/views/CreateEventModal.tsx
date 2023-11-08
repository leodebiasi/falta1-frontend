import {
  Alert,
  AlertColor,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  SnackbarCloseReason,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { SyntheticEvent, useState } from "react";

interface StyledModalProps {
  isOpen: boolean;
  closeModal: () => void;
  refreshEvents: () => void;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const CreateEventModal: React.FC<StyledModalProps> = ({
  isOpen,
  closeModal,
  refreshEvents,
}) => {
  const [eventData, setEventData] = useState({
    description: "",
    modality: "",
    value: "",
    date: "",
    address: "",
    people_count: "",
    image: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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

  const handleModalClose = () => {
    setEventData({
      description: "",
      modality: "",
      value: "",
      date: "",
      address: "",
      people_count: "",
      image: "",
      password: "",
    });
    closeModal();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_PROD}/create-event`,
        {
          ...eventData,
          value: parseFloat(eventData.value),
          people_count: parseInt(eventData.people_count, 10),
        }
      );

      if (response.status === 201) {
        showSnackbar("Evento criado com sucesso!", "success");
        handleModalClose();
        refreshEvents();
      }
    } catch (error) {
      console.error("Houve um erro ao criar o evento:", error);
      showSnackbar(
        "Erro ao criar o evento. Por favor, tente novamente mais tarde.",
        "warning"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleModalClose}>
        <DialogTitle>Criar Evento</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Descrição"
            type="text"
            fullWidth
            value={eventData.description}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="modality"
            label="Modalidade"
            type="text"
            fullWidth
            value={eventData.modality}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="value"
            label="Valor"
            type="number"
            fullWidth
            value={eventData.value}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="date"
            label="Data"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={eventData.date}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="address"
            label="Endereço"
            type="text"
            fullWidth
            value={eventData.address}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="people_count"
            label="Número de pessoas"
            type="number"
            fullWidth
            value={eventData.people_count}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="image"
            label="URL da Imagem"
            type="url"
            fullWidth
            value={eventData.image}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="password"
            label="Senha para Editar/Apagar"
            type="password"
            fullWidth
            value={eventData.password}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateEventModal;
