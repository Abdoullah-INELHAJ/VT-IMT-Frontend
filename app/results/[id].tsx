import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Platform,
  Button,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

export default function ResultsScreen() {
  const { id } = useLocalSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/races/${id}/results`);
        setResults(res.data);
      } catch (err) {
        console.error("Erreur fetch résultats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Chargement des résultats...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/vttt.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Résultats de la course #{id}</Text>

        {results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  {item.rank}. {item.name}
                </Text>
                <Text>Temps : {item.timeSeconds} sec</Text>
              </View>
            )}
          />
        ) : (
          <Text>Aucun résultat disponible pour cette course.</Text>
        )}

        <View style={{ marginTop: 10, marginBottom: -65 }}>
          <Button title="Retour" onPress={() => router.push("/home")} />
        </View>
      </View>

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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 20,
    paddingBottom: 120,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },

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
