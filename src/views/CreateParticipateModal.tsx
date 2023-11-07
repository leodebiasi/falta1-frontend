import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import QRCode from "qrcode.react";
import React, { useEffect, useState } from "react";

interface ParticipateModalProps {
  isOpen: boolean;
  closeModal: () => void;
  eventId: number;
}

const ParticipateModal: React.FC<ParticipateModalProps> = ({
  isOpen,
  closeModal,
  eventId,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState("");
  const [brCode, setBrCode] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (isOpen && activeStep === 1) {
      const websocket = new WebSocket("wss://falta1.onrender.com/ws");
      setWs(websocket);

      websocket.onopen = () => {
        console.log("WebSocket connection established");
      };

      websocket.onmessage = (event) => {
        if (event.data === "paid") {
          alert("Pagamento confirmado!");
          closeModal();
        }
      };

      websocket.onerror = (event) => {
        console.error("WebSocket error:", event);
      };

      websocket.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
      };

      return () => {
        websocket.close();
      };
    }
  }, [isOpen, activeStep, closeModal]);

  const fetchBrCode = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL_PROD}/events/${eventId}/qrcode`
    );
    const data = await response.json();
    setBrCode(data.brCode);
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      await fetchBrCode();
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} fullWidth maxWidth="sm">
      <DialogTitle>
        Participar do Evento
        <IconButton
          style={{ position: "absolute", right: "8px", top: "8px" }}
          onClick={closeModal}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>Informe seu nome</StepLabel>
            </Step>
            <Step>
              <StepLabel>Pagamento via PIX</StepLabel>
            </Step>
          </Stepper>
        </Box>
        {activeStep === 0 ? (
          <TextField
            fullWidth
            variant="outlined"
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
        ) : (
          <div style={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Faça o pagamento usando o QRCode abaixo:
            </Typography>
            <QRCode value={brCode} />
          </div>
        )}
      </DialogContent>
      <DialogActions
        style={{
          justifyContent: activeStep === 0 ? "flex-end" : "space-between",
        }}
      >
        {activeStep > 0 && (
          <Button variant="contained" color="primary" onClick={handleBack}>
            Voltar
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={activeStep === 1}
        >
          {activeStep === 0 ? "Avançar" : "Aguardando pagamento..."}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParticipateModal;
