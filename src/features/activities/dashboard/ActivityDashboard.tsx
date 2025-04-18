import { Grid2 } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";
import ActivityForm from "../form/ActivityForm";

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
  onCreateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
};

export default function ActivityDashboard({ activities, onCreateActivity, onDeleteActivity }: Props) {
  return (
    <Grid2 container spacing={3}>
      <Grid2 size={7}>
        <ActivityList activities={activities} onDeleteActivity={onDeleteActivity} />
      </Grid2>
      <Grid2 size={5} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <ActivityDetail />
        <ActivityForm 
        onCreateActivity={onCreateActivity} 
        />
      </Grid2>
    </Grid2>
  );
}
