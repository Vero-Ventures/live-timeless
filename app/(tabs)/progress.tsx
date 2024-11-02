// app/tabs/Progress.tsx

import React, { useEffect, useState } from "react";
import { FlatList, View, Text, SafeAreaView, StyleSheet } from "react-native";
import HabitStatCard from "../../components/ui/HabitStatCard";
import { HabitStat } from "../../convex/fetchHabitStats"; // Import HabitStat type from backend
import { fontFamily } from "~/lib/font";

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

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (!habits)
    return <Text style={styles.noDataText}>No habits data available.</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Progress</Text>

        <FlatList
          data={habits}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={() => (
            <Text style={styles.noDataText}>No habits data available.</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <HabitStatCard
                name={item.name}
                duration={item.duration}
                longestStreak={item.longestStreak}
                total={item.total}
                dailyAverage={item.dailyAverage}
                skipped={item.skipped}
                failed={item.failed}
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#082139", // Background color consistent with Challenges page
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#082139",
  },
  title: {
    fontFamily: fontFamily.openSans.bold,
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 16,
  },
  listContentContainer: {
    paddingBottom: 60,
  },
  cardWrapper: {
    backgroundColor: "#0e2942",
    borderRadius: 8,
    marginBottom: 10,
    padding: 16,
  },
  loadingText: {
    fontFamily: fontFamily.openSans.medium,
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
  },
  noDataText: {
    fontFamily: fontFamily.openSans.medium,
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Progress;
