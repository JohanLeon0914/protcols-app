import { Link } from "expo-router";
import { Image, StyleSheet, View, TouchableOpacity, Text } from "react-native";
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Link href="/tl">
          <Text style={styles.buttonText}>Formato TL</Text>
        </Link>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Link href="/protocol">
          <Text style={styles.buttonText}>Protocolo</Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
