import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

import { Link } from "expo-router";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { useState } from "react";

import { auth } from "@/lib/firebase";
import {
    signInWithEmailAndPassword
} from "firebase/auth";




export default function Index(){
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function handleLogin() {
    try {
      console.log("Login --> ", email.trim());
      const logged = await signInWithEmailAndPassword(auth, email.trim(), senha);
      console.log("LOGIN OK uid: ", logged.user.uid);
      Alert.alert("Login Ok ", logged.user.email ?? "");
    } catch (error) {
      console.log("Login failed ", error);  
    }
  }
    return(
        <KeyboardAvoidingView
            style={{flex:1}}
            behavior={Platform.select({ios:"padding", android:"height"})}
            >
            <ScrollView 
                contentContainerStyle={{ flexGrow:1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <Image 
                        source={require('@/assets/image1.png')}
                        style={styles.ilustration} 
                    />
                    <Text style={styles.title}>Entrar {email}</Text>
                    <Text style={styles.subtitle}>Acesse sua conta com e-mail e senha</Text>
                    <View style={styles.form}>
                        <Input placeholder="E-mail" 
                            keyboardType="email-address"
                            onChangeText={setEmail}
                        />
                        <Input placeholder="Senha" 
                            secureTextEntry 
                            onChangeText={setSenha}
                            />
                        <Button label="Entrar" onPress={handleLogin}/>
                        {/* <Button label="Entrar" style={{ backgroundColor: "green"}}/> */}
                    </View>
                    <Text style={styles.footerText}>Não tem uma conta? 
                        <Link href="/signup" style={styles.footerLink}>
                            {" "}Cadastre-se aqui
                        </Link>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
} 

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#FDFDFD",
        padding:32
    },
    ilustration:{
        width: "100%",
        height: 330,
        resizeMode:"contain",
        marginTop:62
    }, 
    footerText:{
        textAlign:"center",
        marginTop:24,
        color:"#585860",
    },
    footerLink:{
        color:"#0929b8",
        fontWeight:700
    },
    form: {
        marginTop:24,
        gap:12
    },
    title:{
        fontSize: 32,
        fontWeight: 900
    },
    subtitle:{
        fontSize:16
    }
})