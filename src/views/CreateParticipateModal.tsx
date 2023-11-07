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
import React, { useState } from "react";

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
        Confirmação
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
        style={{ justifyContent: activeStep === 0 ? "flex-end" : "flex-start" }}
      >
        {activeStep === 0 && (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Avançar
          </Button>
        )}
        {activeStep === 1 && (
          <Button variant="contained" color="primary" onClick={handleBack}>
            Voltar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ParticipateModal;
