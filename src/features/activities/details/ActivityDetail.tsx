import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

type Props = {};

export default function ActivityDetail({}: Props) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardMedia component="img" src={`/images/categoryImages/food.jpg`} />
      <CardContent>
        <Typography variant="h5">Activity Title</Typography>
        <Typography variant="subtitle1" fontWeight="light">
          Activity Date
        </Typography>
        <Typography variant="body1">Activity Description</Typography>
      </CardContent>
      <CardActions>
        <Button color="primary">Edit</Button>
        <Button color="inherit">Cancel</Button>
      </CardActions>
    </Card>
  );
}
