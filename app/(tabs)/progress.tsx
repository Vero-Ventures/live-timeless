import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import HabitStatCard from "../../components/ui/HabitStatCard";
import { HabitStat } from "../../convex/fetchHabitStats"; // Import HabitStat type from backend

const Progress: React.FC = () => {
  const [habits, setHabits] = useState<HabitStat[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Generate dummy data
        const dummyHabits: HabitStat[] = [
          {
            _id: "1",
            name: "Exercise",
            duration: "30 mins per day",
            longestStreak: 10,
            total: 300,
            dailyAverage: 30,
            skipped: 2,
            failed: 1,
          },
          {
            _id: "2",
            name: "Reading",
            duration: "20 mins per day",
            longestStreak: 15,
            total: 200,
            dailyAverage: 20,
            skipped: 1,
            failed: 0,
          },
          {
            _id: "3",
            name: "Meditation",
            duration: "10 mins per day",
            longestStreak: 20,
            total: 100,
            dailyAverage: 10,
            skipped: 0,
            failed: 0,
          },
        ];
        setHabits(dummyHabits);
      } catch (error) {
        console.error("Error generating dummy habit stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (!habits) return <Text>No habits data available.</Text>;

  return (
    <View>
      <Text>Progress</Text>
      {habits.map((habit) => (
        <HabitStatCard
          key={habit._id}
          name={habit.name}
          duration={habit.duration}
          longestStreak={habit.longestStreak}
          total={habit.total}
          dailyAverage={habit.dailyAverage}
          skipped={habit.skipped}
          failed={habit.failed}
        />
      ))}
    </View>
  );
};

export default Progress;
