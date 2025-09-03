import React from "react";
import { View, Text, Button, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
  source={require("../assets/images/vttt.png")}
  style={styles.background}  
>
  <View style={styles.overlay}>
    <Text style={styles.title}>Bienvenue sur VT'IMT 🚴‍♂️</Text>
    <Button title="Page de Connexion" onPress={() => router.push("/login")} />
  </View>
</ImageBackground>

  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
});
