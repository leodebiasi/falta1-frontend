import { Avatar, Box, Card, Typography } from "@mui/material";
import React, { useEffect } from "react";

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
  return `R$ ${(value / peopleCount).toFixed(2)}`;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    day: date.toLocaleDateString("pt-BR", { day: "2-digit" }),
    month: date
      .toLocaleDateString("pt-BR", { month: "short" })
      .toUpperCase()
      .replace(".", ""),
  };
};

interface EventCardProps {
  event: AppEvent;
  onEventClick: (event: AppEvent) => void;
}

function EventCard({ event, onEventClick }: EventCardProps) {
  const { day, month } = formatDate(event.date);

  return (
    <Card
      style={{
        margin: "1rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
      }}
    >
      <Avatar
        src={event.image}
        alt={event.description}
        variant="rounded"
        style={{ width: 50, height: 50 }}
      />
      <Box flex={1} marginLeft={2}>
        <Typography variant="h6">{event.description}</Typography>
        <Typography variant="subtitle1">
          {formatValue(event.value, event.people_count)}
        </Typography>
      </Box>
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
    const response = await fetch(
      `${process.env.REACT_APP_API_URL_PROD}/get-events`
    );
    if (!response.ok) throw new Error("Response not ok");
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
  }
};

const EventList: React.FC<Props> = ({ onEventClick, events, setEvents }) => {
  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  return (
    <div>
      {events &&
        events.map((event) => (
          <EventCard key={event.id} event={event} onEventClick={onEventClick} />
        ))}
    </div>
  );
};

export default EventList;
