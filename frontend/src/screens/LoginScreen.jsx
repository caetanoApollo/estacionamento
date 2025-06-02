import React, { useState } from 'react';
import { View, StyleSheet, Alert }
  from 'react-native';
import { TextInput, Button, Text, Card, useTheme, Surface, ActivityIndicator } from 'react-native-paper';
import { login } from '../services/api';  // Importa a função de login da API

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  // Lida com o processo de login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);  // Chama a API para login
      if (result.success) { // Verifica o sucesso do login
        navigation.navigate('Vagas', { user: result.user });  // Navega para a tela de Vagas em caso de sucesso
      } else {
        Alert.alert('Erro de Login', result.message || 'Não foi possível fazer login. Verifique suas credenciais.');  // Exibe mensagem de erro
      }
    } catch (error) {
      console.error("Erro de login:", error);
      Alert.alert('Erro de Login', 'Ocorreu um problema ao tentar fazer login. Tente novamente.');
    }
    setLoading(false);
  };

  return (
    <Surface style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Login
          </Text>
          <TextInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
          />
          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            loading={loading}
            disabled={loading}
            icon="login"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Cadastro')} // Navega para a tela de Cadastro
            style={styles.buttonLink}
            textColor={colors.primary}
          >
            Criar conta
          </Button>
        </Card.Content>
      </Card>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Adicionado uma cor de fundo clara
  },
  card: {
    borderRadius: 12, // Borda levemente arredondada para um visual mais suave
    paddingVertical: 20,
    paddingHorizontal: 15, // Aumentado o padding horizontal
    elevation: 4, // Adicionado sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30, // Aumentado o margin inferior
    fontWeight: 'bold', // Título em negrito
    color: '#333', // Cor de texto mais escura
  },
  input: {
    marginBottom: 18, // Aumentado o margin inferior
    backgroundColor: '#f9f9f9', // Fundo claro para os inputs
  },
  button: {
    marginTop: 10, // Ajustado o margin superior
    paddingVertical: 4,
    borderRadius: 8, // Adicionado borda arredondada ao botão
  },
  buttonLink: {
    marginTop: 20, // Aumentado o margin superior
    // A cor do texto já é gerenciada pelo tema do Paper
  },
});