import React, { useEffect, useState } from "react";

interface Event {
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
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Eventos</h2>
      {events.map((event, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            border: "1px solid #ddd",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={() => onEventClick(event)}
        >
          {/* ... */}
        </div>
      ))}
    </div>
  );
};

export default EventList;
