import { Avatar, Box, Card, Typography, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
}

function EventCard({ event }: EventCardProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { day, month } = formatDate(event.date);

  const handleClick = () => {
    navigate(`/event/${event.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        m: 2,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
        boxShadow: theme.shadows[3],
        ":hover": {
          boxShadow: theme.shadows[6],
        },
        borderRadius: theme.shape.borderRadius,
        transition: theme.transitions.create(["box-shadow"], {
          duration: theme.transitions.duration.standard,
        }),
      }}
    >
      <Avatar
        src={event.image}
        alt={event.description}
        variant="rounded"
        sx={{ width: 60, height: 60, mr: 5 }}
      />
      <Box flex={1}>
        <Typography
          variant="h6"
          color="secundary"
          component="div"
          gutterBottom
          sx={{
            fontStyle: "italic",
            fontWeight: "bold",
          }}
        >
          {event.description}
        </Typography>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{
            fontWeight: "bold",
          }}
        >
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
          color: "primary.contrastText",
          p: 1,
          borderRadius: 2,
          minWidth: 70,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          noWrap
          sx={{
            fontWeight: "bold",
          }}
        >
          {day}
        </Typography>
        <Typography
          component="div"
          noWrap
          sx={{
            fontWeight: "bold",
          }}
        >
          {month}
        </Typography>
      </Box>
    </Card>
  );
}

interface Props {
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

const EventList: React.FC<Props> = ({ events, setEvents }) => {
  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  return (
    <div>
      {events &&
        events.map((event) => <EventCard key={event.id} event={event} />)}
    </div>
  );
};

export default EventList;
