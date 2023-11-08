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
import axios from "axios";
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
  const [txId, setTxId] = useState("");

  useEffect(() => {
    if (isOpen && activeStep === 1) {
      console.log("txId>>>>", txId);

      const websocket = new WebSocket(
        `wss://falta1.onrender.com/ws?txid=${txId}`
      );

      console.log("WebSocket connection established");

      websocket.onopen = () => {
        console.log("WebSocket connection established");

        if (txId) {
          websocket.send(JSON.stringify({ txId: txId }));
        }
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("data>>>>", data);
        if (data.status === "paid") {
          setActiveStep(2);
        }
      };

      return () => {
        websocket.close();
      };
    }
  }, [isOpen, activeStep, closeModal, txId]);

  const fetchBrCode = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_PROD}/events/${eventId}/qrcode`,
        {
          name: name,
        }
      );
      setBrCode(response.data.brCode);
      setTxId(response.data.txId);
    } catch (error) {
      console.error("Falha ao obter o BRCode e enviar o nome:", error);
    }
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
            <Step>
              <StepLabel>Confirmação</StepLabel>
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
