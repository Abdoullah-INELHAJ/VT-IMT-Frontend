import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Platform,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (!storedUserId) {
          console.warn("Aucun utilisateur connecté.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/me`, {
          headers: { "X-User-Id": storedUserId },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Erreur fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleViewResults = async (raceId: number) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/races/${raceId}/results`);
      if (!res.data || res.data.length === 0) {
        await axios.post(`${API_BASE_URL}/api/races/${raceId}/simulate`);
      }
      router.push({
        pathname: "/results/[id]",
        params: { id: raceId.toString() },
      });
    } catch (err) {
      console.error("Erreur lors de l’affichage des résultats:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Aucun utilisateur trouvé </Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/vttt.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Mon Profil</Text>
        <Text style={styles.info}>Nom : {user.fullName}</Text>
        <Text style={styles.info}>Email : {user.email}</Text>

        <Text style={[styles.subtitle, { marginTop: 20 }]}>
          Mes inscriptions :
        </Text>
        {user.registrations && user.registrations.length > 0 ? (
          <FlatList
            data={user.registrations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.raceTitle}</Text>
                <Text>Date : {item.raceDate}</Text>
                <Text>Lieu : {item.raceLocation}</Text>

                {new Date(item.raceDate) < new Date() && (
                  <Text
                    style={styles.link}
                    onPress={() => handleViewResults(item.raceId)}
                  >
                     Voir résultats
                  </Text>
                )}
              </View>
            )}
          />
        ) : (
          <Text>Aucune course inscrite.</Text>
        )}
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
  background: { flex: 1, resizeMode: "cover", width: "100%", height: "100%" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 20,
    paddingBottom: 80, 
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 15 },
  info: { fontSize: 16, marginBottom: 5 },
  subtitle: { fontSize: 20, fontWeight: "bold" },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  link: {
    marginTop: 10,
    color: "blue",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  // 🔹 Bottom nav
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
