import { Avatar, Box, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export interface AppEvent {
  id: string;
  description: string;
  value: number;
  date: string;
  address: string;
  people_count: number;
  image: string;
  password: string;
  created_at: string;
  updated_at: string;
}

function formatValue(value: number, peopleCount: number) {
  const perPersonValue = (value / peopleCount).toFixed(2);
  return `R$ ${perPersonValue}`;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.toLocaleDateString("pt-BR", { day: "2-digit" });
  const month = date
    .toLocaleDateString("pt-BR", { month: "short" })
    .toUpperCase()
    .replace(".", "");
  return { day, month };
};

function EventCard({ event, onEventClick }: any) {
  const { day, month } = formatDate(event.date);
  return (
    <Card
      onClick={() => onEventClick(event)}
      style={{
        margin: "1rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
      }}
    >
      {/* Avatar ou imagem à esquerda */}
      <Avatar
        src={event.image}
        alt={event.description}
        variant="rounded"
        style={{ width: 50, height: 50 }}
      />

      {/* Detalhes do evento */}
      <Box flex={1} marginLeft={2}>
        <Typography variant="h6">{event.description}</Typography>
        <Typography variant="subtitle1">R$ {event.value.toFixed(2)}</Typography>
      </Box>

      {/* Data à direita */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "primary.main",
          color: "white",
          width: 70,
          height: 70,
          borderRadius: "10px",
        }}
      >
        <Typography variant="h6" component="div">
          {day}
        </Typography>
        <Typography variant="caption" component="div">
          {month}
        </Typography>
      </Box>
    </Card>
  );
}

interface Props {
  onEventClick: (event: AppEvent) => void;
  events: AppEvent[];
  setEvents: React.Dispatch<React.SetStateAction<AppEvent[]>>;
}

export const fetchEvents = async () => {
  try {
    const response = await fetch("http://localhost:8080/get-events");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
  }
};

const EventList: React.FC<Props> = ({ onEventClick, events, setEvents }) => {
  const [localEvents, setLocalEvents] = useState<AppEvent[]>([]); // Renomeado para 'localEvents'

  useEffect(() => {
    fetchEvents().then((data) => {
      if (data) {
        setLocalEvents(data);
      }
    });
  }, []);

  return (
    <div>
      {localEvents.map((event) => (
        <EventCard key={event.id} event={event} onEventClick={onEventClick} />
      ))}
    </div>
  );
};

export default EventList;
