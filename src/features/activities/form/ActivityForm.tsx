import { Box, Button, Paper, TextField, Typography } from "@mui/material";

type Props = {};

export default function ActivityForm({}: Props) {
  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Create activity
      </Typography>
      <Box component="form" display="flex" flexDirection="column" gap={3}>
        <TextField name="title" label="Title" />
        <TextField name="description" label="Description" multiline rows={3} />
        <TextField name="category" label="Category" />
        <TextField name="date" label="Date" type="date" />
        <TextField name="city" label="City" />
        <TextField name="venue" label="Venue" />
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
