import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { auth } from "@/lib/firebase";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/");
        return;
      }

      setUser(currentUser);
    });

    return unsubscribe;
  }, [router]);

  function goToCadastro() {
    router.push("/cadastro");
  }

  function goToListagem() {
    router.push("/listagem");
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error: any) {
      console.log("Erro ao sair:", error);
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Image
            source={require("@/assets/image1.png")}
            style={styles.ilustration}
          />

          <Text style={styles.title}>Sua conta</Text>
          <Text style={styles.subtitle}>
            E-mail: {user?.email ?? "-"}
          </Text>

          <View style={styles.form}>
            <TouchableOpacity style={styles.button} onPress={goToListagem}>
              <Text style={styles.buttonText}>Ver listagem</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={goToCadastro}>
              <Text style={styles.buttonText}>Ir para cadastro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
              <Text style={styles.buttonLogoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFD",
    padding: 32,
  },
  ilustration: {
    width: "100%",
    height: 330,
    resizeMode: "contain",
    marginTop: 62,
  },
  form: {
    marginTop: 24,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0929b8",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonLogout: {
    borderWidth: 1,
    borderColor: "#d33",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonLogoutText: {
    color: "#d33",
    fontWeight: "700",
    fontSize: 16,
  },
});
