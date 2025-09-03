import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { Platform } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

const handleLogin = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/users`, {
      email,
      fullName: name,
    });
    console.log("Réponse backend:", res.data);

    await AsyncStorage.setItem("userId", res.data.id.toString());
    router.replace("/home");
  } catch (err) {
    console.error("Erreur login:", err);
    alert("Impossible de contacter le backend. Vérifie qu'il est lancé.");
  }
};


  return (
    <ImageBackground
      source={require("../assets/images/vttt.png")} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Connexion</Text>

          <Text>Email :</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Votre email"
            placeholderTextColor="#888"
          />

          <Text>Nom :</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Votre nom"
            placeholderTextColor="#888"
          />

          <Button title="Se connecter" onPress={handleLogin} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.3)",
    },
  card: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});
