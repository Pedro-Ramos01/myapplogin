import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "@/lib/firebase";

type ShoeItem = {
  id: string;
  marca: string;
  modelo: string;
  numero: string;
  createdAt: Timestamp | null;
  createdByEmail: string;
};

export default function Listagem() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<ShoeItem[]>([]);

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

  useEffect(() => {
    if (!user) {
      return;
    }

    const itemsQuery = query(
      collection(db, "users", user.uid, "tenis"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      itemsQuery,
      (snapshot) => {
        const parsed: ShoeItem[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            marca: (data as any).marca ?? "",
            modelo: (data as any).modelo ?? "",
            numero: (data as any).numero ?? "",
            createdAt: (data as any).createdAt ?? null,
            createdByEmail: (data as any).createdByEmail ?? "",
          };
        });
        setItems(parsed);
      },
      (error) => {
        console.log("Erro ao listar itens:", error);
        if (items.length === 0) {
          Alert.alert("Erro", "Não foi possível carregar a lista. Verifique sua conexão.");
        }
      }
    );

    return unsubscribe;
  }, [user, items.length]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <View style={styles.container}>
        <Image
          source={require("@/assets/image1.png")}
          style={styles.ilustration}
        />

        <Text style={styles.title}>Todos os cadastros</Text>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>Nenhum item encontrado.</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>
                {item.marca} • {item.modelo} • Nº {item.numero}
              </Text>
              <Text style={styles.itemMeta}>
                Cadastrado por: {item.createdByEmail || "-"}
              </Text>
              <Text style={styles.itemDate}>
                {item.createdAt
                  ? new Date(item.createdAt.toMillis()).toLocaleString()
                  : "-"}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
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
    height: 200,
    resizeMode: "contain",
    marginTop: 32,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  item: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  itemText: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  itemMeta: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: "#777",
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#0929b8",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",    fontWeight: "700",
    fontSize: 16,
  },
});