import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

interface StyledModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const StyledModal: React.FC<StyledModalProps> = (props) => {
  const [eventData, setEventData] = useState({
    description: "",
    value: "",
    date: "",
    address: "",
    people_count: "",
    image: "",
    password: "",
  });

  const handleClose = () => {
    props.closeModal();
  };

  const handleSubmit = () => {
    axios
      .post("/create-event", {
        ...eventData,
        value: parseFloat(eventData.value),
        people_count: parseInt(eventData.people_count),
      })
      .then((response) => {
        if (response.status === 201) {
          alert("Evento criado com sucesso!");
        }
      })
      .catch((error) => {
        console.error("Houve um erro ao criar o evento:", error);
        alert(
          "Houve um erro ao criar o evento. Por favor, tente novamente mais tarde."
        );
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({
      ...eventData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <Dialog open={props.isOpen} onClose={handleClose}>
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
          label="Senha"
          type="password"
          fullWidth
          value={eventData.password}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StyledModal;
