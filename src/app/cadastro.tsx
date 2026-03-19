import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { auth, db } from "@/lib/firebase";

export default function Cadastro() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [numero, setNumero] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const userShoesCollection = useMemo(() => {
    if (!user) return null;
    return collection(db, "users", user.uid, "tenis");
  }, [user]);

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

  async function handleSave() {
    if (!marca.trim() || !modelo.trim() || !numero.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos para cadastrar um tênis.");
      return;
    }

    if (!user || !userShoesCollection) return;

    setIsSaving(true);

    try {
      await addDoc(userShoesCollection, {
        marca: marca.trim(),
        modelo: modelo.trim(),
        numero: numero.trim(),
        createdAt: serverTimestamp(),
        createdByUid: user.uid,
        createdByEmail: user.email ?? "",
      });

      setMarca("");
      setModelo("");
      setNumero("");

      Alert.alert("Sucesso", "Cadastro salvo com sucesso!");
    } catch (error: any) {
      console.log("Erro ao salvar cadastro:", error);
      Alert.alert("Erro", "Não foi possível salvar o cadastro. Tente novamente.");
    } finally {
      setIsSaving(false);
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
            source={require("@/assets/image2.png")}
            style={styles.ilustration}
          />

          <Text style={styles.title}>Novo cadastro</Text>
          <Text style={styles.subtitle}>
            Cadastre um novo tênis
          </Text>

          <View style={styles.form}>
            <TextInput
              value={marca}
              onChangeText={setMarca}
              placeholder="Marca"
              style={styles.input}
            />

            <TextInput
              value={modelo}
              onChangeText={setModelo}
              placeholder="Modelo"
              style={styles.input}
            />

            <TextInput
              value={numero}
              onChangeText={setNumero}
              placeholder="Número"
              keyboardType="numeric"
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.buttonText}>
                {isSaving ? "Salvando..." : "Salvar cadastro"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonBack}
              onPress={() => router.replace("/home")}
            >
              <Text style={styles.buttonBackText}>Voltar</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 4,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#0929b8",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonBack: {
    borderWidth: 1,
    borderColor: "#0929b8",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonBackText: {
    color: "#0929b8",
    fontWeight: "700",
    fontSize: 16,
  },
});
