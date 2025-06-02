import React from "react";
import {View, Text, Image, StyleSheet} from 'react-native';

const ProfileCard = ({name, description, image}) => {
    return (
        <View style={styles.card}>
            <Image source={{uri: image}} style={styles.profileImage}/> 
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    )
}
//variavel para estilos com a função de estilos do React
const styles = StyleSheet.create({
    card:{
        backgroundColor: '#fff',
        padding: 20,
        margin: 20,
        alignItems: 'center',
        borderRadius: 10,
        elevation: 3, //sombra no Android
        shadowColor: '#000', // sombra iOS (mas funciona universal)
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 2},
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center'
    }
})

export default ProfileCard;