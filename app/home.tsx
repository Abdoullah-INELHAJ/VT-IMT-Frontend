import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

export default function Home() {
  const [races, setRaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/races`);
        setRaces(res.data);
      } catch (err) {
        console.error("Erreur fetch races:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000000ff" />
        <Text style={styles.loadingText}>Chargement des courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Courses disponibles 🚴</Text>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        data={races}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/races/[id]",
                params: { id: item.id.toString() },
              })
            }
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>
              {item.date} • {item.location}
            </Text>
            <Text style={styles.cardInfo}>
              Places restantes : {item.capacity}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Bandeau bas */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/home")}>
          <Text style={styles.navText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.navText}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },

  header: {
    backgroundColor: "#4A90E2",
    paddingVertical: 20,
    alignItems: "center",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 4,
  },
  headerText: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#555" },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#0A1931" },
  cardSubtitle: { fontSize: 14, color: "#555", marginTop: 4 },
  cardInfo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000ff",
    marginTop: 6,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 14, fontWeight: "600", color: "#4A90E2" },
});
