import { useState } from "react";
import NavBar from "./NavBar";
import { Container, CssBaseline } from "@mui/material";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

const data = [
  {
    id: "1",
    title: "Past Activity 1",
    date: new Date(new Date().setMonth(new Date().getMonth() - 2)),
    description: "Activity 2 months ago",
    category: "drinks",
    city: "London",
    venue:
      "The Lamb and Flag, 33, Rose Street, Seven Dials, Covent Garden, London, Greater London, England, WC2E 9EB, United Kingdom",
    latitude: 51.51171665,
    longitude: -0.1256611057818921,
    isCanceled: false,
  },
  {
    id: "2",
    title: "Past Activity 2",
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    description: "Activity 1 month ago",
    category: "culture",
    city: "Paris",
    venue:
      "Louvre Museum, Rue Saint-Honoré, Quartier du Palais Royal, 1st Arrondissement, Paris, Ile-de-France, Metropolitan France, 75001, France",
    latitude: 48.8611473,
    longitude: 2.33802768704666,
    isCanceled: false,
  },
  {
    id: "3",
    title: "Future Activity 1",
    date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    description: "Activity 1 month in future",
    category: "culture",
    city: "London",
    venue: "Natural History Museum",
    latitude: 51.496510900000004,
    longitude: -0.17600190725447445,
    isCanceled: false,
  },
  {
    id: "4",
    title: "Future Activity 2",
    date: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    description: "Activity 2 months in future",
    category: "music",
    city: "London",
    venue: "The O2",
    latitude: 51.502936649999995,
    longitude: 0.0032029278126681844,
    isCanceled: false,
  },
  {
    id: "5",
    title: "Future Activity 3",
    date: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    description: "Activity 3 months in future",
    category: "drinks",
    city: "London",
    venue: "The Mayflower",
    latitude: 51.501778,
    longitude: -0.053577,
    isCanceled: false,
  },
  {
    id: "6",
    title: "Future Activity 4",
    date: new Date(new Date().setMonth(new Date().getMonth() + 4)),
    description: "Activity 4 months in future",
    category: "drinks",
    city: "London",
    venue: "The Blackfriar",
    latitude: 51.512146650000005,
    longitude: -0.10364680647106028,
    isCanceled: false,
  },
  {
    id: "7",
    title: "Future Activity 5",
    date: new Date(new Date().setMonth(new Date().getMonth() + 5)),
    description: "Activity 5 months in future",
    category: "culture",
    city: "London",
    venue:
      "Sherlock Holmes Museum, 221b, Baker Street, Marylebone, London, Greater London, England, NW1 6XE, United Kingdom",
    latitude: 51.5237629,
    longitude: -0.1584743,
    isCanceled: false,
  },
  {
    id: "8",
    title: "Future Activity 6",
    date: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    description: "Activity 6 months in future",
    category: "music",
    city: "London",
    venue:
      "Roundhouse, Chalk Farm Road, Maitland Park, Chalk Farm, London Borough of Camden, London, Greater London, England, NW1 8EH, United Kingdom",
    latitude: 51.5432505,
    longitude: -0.15197608174931165,
    isCanceled: false,
  },
  {
    id: "9",
    title: "Future Activity 7",
    date: new Date(new Date().setMonth(new Date().getMonth() + 7)),
    description: "Activity 2 months ago",
    category: "travel",
    city: "London",
    venue: "River Thames, England, United Kingdom",
    latitude: 51.5575525,
    longitude: -0.781404,
    isCanceled: false,
  },
  {
    id: "10",
    title: "Future Activity 8",
    date: new Date(new Date().setMonth(new Date().getMonth() + 8)),
    description: "Activity 8 months in future",
    category: "film",
    city: "London",
    venue: "River Thames, England, United Kingdom",
    latitude: 51.5575525,
    longitude: -0.781404,
    isCanceled: true,
  },
];

function App() {
  const [activities, setActivities] = useState(data);

  const handleCreateActivity = (activity) => {
    setActivities([activity,...activities]);
  };

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  return (
    <>
      <CssBaseline />
      <NavBar openForm={() => {}} />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <ActivityDashboard 
        activities={activities} 
        onCreateActivity={handleCreateActivity}
        onDeleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;
