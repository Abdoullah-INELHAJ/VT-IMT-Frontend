import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

export default function RaceDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [race, setRace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);

        const res = await axios.get(`${API_BASE_URL}/api/races/${id}`);
        setRace(res.data);
      } catch (err) {
        console.error("Erreur fetch course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleRegister = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/races/${id}/register`,
        {},
        { headers: { "X-User-Id": userId || "" } }
      );
      alert("Inscription réussie !");
    } catch (err) {
      console.error("Erreur inscription:", err);
      alert("Erreur lors de l'inscription");
    }
  };

  const handleViewResults = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/races/${id}/results`);
      if (!res.data || res.data.length === 0) {
        await axios.post(`${API_BASE_URL}/api/races/${id}/simulate`);
      }
      router.push({ pathname: "/results/[id]", params: { id: id.toString() } });
    } catch (err) {
      console.error("Erreur résultats:", err);
      alert("Impossible d'afficher les résultats");
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

  if (!race) {
    return (
      <View style={styles.center}>
        <Text>Course introuvable !</Text>
      </View>
    );
  }

  const isPast = new Date(race.date) < new Date();

  return (
    <ImageBackground
      source={require("../../assets/images/vttt.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>

        <Text style={styles.title}>{race.title}</Text>
        <Text>Date : {race.date}</Text>
        <Text>Lieu : {race.location}</Text>
        <Text>Capacité : {race.capacity}</Text>
        <Text style={{ marginTop: 10, fontWeight: "bold" }}>Participants :</Text>

        <FlatList
          data={race.participants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text>- {item}</Text>}
        />

        <View style={{ marginTop: 20 }}>
          {!isPast ? (
            <Button title="S'inscrire" onPress={handleRegister} />
          ) : (
            <Button title="Voir résultats" onPress={handleViewResults} />
          )}
          <View style={{ marginTop: 10 }}>
    <Button title="Retour" onPress={() => router.push("/home")} />
        </View>
        </View>
      </View>
      
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(255,255,255,0.8)", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});
