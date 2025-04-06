import { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

type Props = {
  onCreateActivity: (activity) => void;
};

export default function ActivityForm({ onCreateActivity }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState("");

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newActivity = {
      id: uuidv4(), // Generate a unique ID
      title,
      description,
      category,
      date: new Date(date), // Ensure date is a Date object
      city,
      venue,
    };
    onCreateActivity(newActivity);
  };

  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Create activity
      </Typography>
      <Box component="form" display="flex" flexDirection="column" gap={3} onSubmit={submitForm}>
        <TextField name="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField name="description" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} />
        <TextField name="category" label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <TextField name="date" label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <TextField name="city" label="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <TextField name="venue" label="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
        <Box display="flex" justifyContent="end" gap={3}>
          <Button color="inherit">Cancel</Button>
          <Button type="submit" color="success" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
