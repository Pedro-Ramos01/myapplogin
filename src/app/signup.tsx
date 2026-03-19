import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

import { Link, useRouter } from "expo-router";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [nome, setNome] = useState<string>("");

  function verificationEmail(): boolean {
    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Email inválido!");
      return false;
    }
    return true;
  }

  function verificationPassword(): boolean {
    if (senha !== confirmarSenha) {
      Alert.alert("As senhas não coincidem");
      return false;
    }
    return true;
  }

  function getFirebaseAuthErrorMessage(error: any): string {
    const code = error?.code ?? "";

    switch (code) {
      case "auth/email-already-in-use":
        return "Este e-mail já está em uso. Faça login ou use outro e-mail.";
      case "auth/invalid-email":
        return "O e-mail informado é inválido.";
      case "auth/weak-password":
        return "A senha precisa ter pelo menos 6 caracteres.";
      case "auth/network-request-failed":
        return "Falha na conexão. Verifique sua internet e tente novamente.";
      case "auth/operation-not-allowed":
        return "Esse tipo de cadastro não está habilitado no Firebase.";
      default:
        return error?.message ?? "Erro desconhecido ao criar conta.";
    }
  }

  async function handleRegister() {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      Alert.alert("Conta criada com sucesso!", user.user.email ?? "", [
        {
          text: "Ok",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error: any) {
      console.log("Erro ao criar conta:", error);
      Alert.alert("Erro ao criar conta", getFirebaseAuthErrorMessage(error));
    }
  }

  function handlePress() {
    if (!verificationEmail()) return;
    if (!verificationPassword()) return;

    handleRegister();
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Image
          source={require("@/assets/image2.png")}
          style={styles.ilustration}
        />

        <Text style={styles.title}>Cadastrar</Text>
        <Text style={styles.subtitle}>Crie sua conta para acessar</Text>

        <View style={styles.form}>
          <Input placeholder="Nome" value={nome} onChangeText={setNome} />

          <Input
            placeholder="E-mail"
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
          />

          <Input
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Input
            placeholder="Confirme sua senha"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <Button label="Cadastrar" onPress={handlePress} />
        </View>

        <Text style={styles.footerText}>
          Já tem uma conta?
          <Link href="/" style={styles.footerLink}>
            {" "}
            Entrar Aqui
          </Link>
        </Text>
      </View>
    </ScrollView>
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
  footerText: {
    textAlign: "center",
    marginTop: 24,
    color: "#585860",
  },
  footerLink: {
    color: "#0929b8",
    fontWeight: "700",
  },
});