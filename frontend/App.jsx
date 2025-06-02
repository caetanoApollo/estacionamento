import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import VagasScreen from './src/screens/VagasScreen';
import EditUserScreen from './src/screens/EditUserScreen'; // Importa a nova tela de edição de usuário

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />
          <Stack.Screen name="Vagas" component={VagasScreen} />
          <Stack.Screen name="EditUser" component={EditUserScreen} options={{ title: 'Editar Perfil' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}