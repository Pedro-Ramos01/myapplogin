import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

import { Link } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index(){
    return(
        <ScrollView contentContainerStyle={{ flexGrow:1 }}>
            <View style={styles.container}>
                <Image 
                    source={require('@/assets/image1.png')}
                    style={styles.ilustration} 
                />
                <Text style={styles.title}>Entrar</Text>
                <Text style={styles.subtitle}>Acesse sua conta com e-mail e senha</Text>
                <View style={styles.form}>
                    <Input placeholder="E-mail" keyboardType="email-address" />
                    <Input placeholder="Senha" secureTextEntry/>
                    <Button label="Entrar" />
                    {/* <Button label="Entrar" style={{ backgroundColor: "green"}}/> */}
                </View>
                <Text style={styles.footerText}>Não tem uma conta? 
                    <Link href="/signup" style={styles.footerLink}>
                        {" "}Cadastre-se aqui
                    </Link>
                </Text>
            </View>
        </ScrollView>
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