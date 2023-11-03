import { Avatar, Box, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface Event {
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

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

function formatValue(value: number, peopleCount: number) {
  const perPersonValue = (value / peopleCount).toFixed(2);
  return `R$ ${perPersonValue}`;
}

function EventCard({ event, onEventClick }: any) {
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
        <Typography variant="subtitle2">{`Society ${
          event.date.split("T")[0]
        }`}</Typography>
        <Typography variant="caption">{event.address}</Typography>
      </Box>

      {/* Data à direita */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="secondary.main"
        color="white"
        width={80}
        height={40}
        borderRadius={15}
      >
        <Typography>{new Date(event.date).getDate()}</Typography>
        <Typography variant="caption">OUT</Typography>
      </Box>
    </Card>
  );
}

interface Props {
  onEventClick: (event: Event) => void;
}

const EventList: React.FC<Props> = ({ onEventClick }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/get-events");
        const data = await response.json();
        setEvents(data);
        console.log(`RETORNO DO BACK: ${data}`);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {events.map((event) => (
        <EventCard key={event.id} event={event} onEventClick={onEventClick} />
      ))}
    </div>
  );
};

export default EventList;
