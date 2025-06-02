import React from "react";
import { Text, View } from "react-native";

export default function OlaMundo(props){
    return(
        <View>
            <Text>Olá, {props.nome}!</Text>
            <Text>Tenho {props.idade} anos!</Text>
        </View>
    )
}