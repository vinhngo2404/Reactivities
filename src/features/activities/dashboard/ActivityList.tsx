import { Box } from "@mui/material";
import ActivityCard from "./ActivityCard";

type Activity = {
  id: string;
  title: string;
  date: Date;
  description: string;
  category: string;
  city: string;
  venue: string;
  latitude: number;
  longitude: number;
  isCanceled: boolean;
};

type Props = {
  activities: Activity[];
};

export default function ActivityList({ activities }: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </Box>
  );
}
