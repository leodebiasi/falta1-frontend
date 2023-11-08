import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ShareIcon from "@mui/icons-material/Share";
import {
  Box,
  Button,
  CircularProgress,
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
  fetchParticipants: () => void;
}

const ParticipateModal: React.FC<ParticipateModalProps> = ({
  isOpen,
  closeModal,
  eventId,
  fetchParticipants,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState("");
  const [brCode, setBrCode] = useState("");
  const [txId, setTxId] = useState("");

  useEffect(() => {
    if (isOpen && activeStep === 1) {
      const websocket = new WebSocket(
        `wss://falta1.onrender.com/ws?txid=${txId}`
      );
      websocket.onopen = () => {
        if (txId) {
          websocket.send(JSON.stringify({ txId: txId }));
        }
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === true) {
          setActiveStep(2);
          fetchParticipants();
        }
      };

      return () => {
        websocket.close();
      };
    }
  }, [isOpen, activeStep, closeModal, txId]);

  const fetchBrCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_PROD}/events/${eventId}/qrcode`,
        {
          nome: name,
        }
      );
      setBrCode(response.data.brCode);
      setTxId(response.data.txId);
    } catch (error) {
      console.error("Falha ao obter o BRCode e enviar o nome:", error);
    } finally {
      setLoading(false);
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
        {activeStep === 0 && (
          <TextField
            fullWidth
            variant="outlined"
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
        )}
        {activeStep === 1 && (
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Faça o pagamento usando o QRCode abaixo:
            </Typography>
            <QRCode value={brCode} />
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FileCopyIcon />}
              sx={{ mt: 2 }}
              onClick={() => {
                navigator.clipboard
                  .writeText(brCode)
                  .then(() => {})
                  .catch(console.error);
              }}
            >
              Copiar BRCode
            </Button>
          </div>
        )}
        {activeStep === 2 && (
          <Box textAlign="center">
            <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h5" gutterBottom>
              Pagamento Confirmado!
            </Typography>
            <Typography>
              Obrigado por confirmar o pagamento. Agora você está oficialmente
              participando do evento!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShareIcon />}
              sx={{ mt: 2 }}
              onClick={() => {
                const eventLink = `https://falta1-frontend.vercel.app/event/${eventId}`;
                if (navigator.share) {
                  navigator
                    .share({
                      title: "Bora Jogar? Falta 1!",
                      url: eventLink,
                    })
                    .catch(console.error);
                } else {
                  navigator.clipboard
                    .writeText(eventLink)
                    .then(() => {
                      console.log("Link copiado para a área de transferência!");
                    })
                    .catch(console.error);
                }
              }}
            >
              Compartilhar Evento
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions
        style={{
          justifyContent: activeStep === 0 ? "flex-end" : "space-between",
        }}
      >
        {activeStep === 1 && (
          <Button variant="contained" color="primary" onClick={handleBack}>
            Voltar
          </Button>
        )}
        {activeStep !== 2 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={loading || activeStep === 1}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : activeStep === 1 ? (
              <span>
                Aguardando pagamento <CircularProgress size={14} />
              </span>
            ) : (
              "Avançar"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ParticipateModal;
