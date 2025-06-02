import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView, // Importar
  Platform, // Para ajustar o behavior
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Appbar,
  useTheme,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import { cadastrar } from '../services/api'; //

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export default function CadastroScreen({ navigation }) {
  const [form, setForm] = useState({ //
    username: '',
    email: '',
    password: '',
    placa: '',
    cor: '',
    modelo: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleChange = (name, value) => { //
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Nome de usuário é obrigatório.';
    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Formato de e-mail inválido.';
    }
    if (!form.password) {
      newErrors.password = 'Senha é obrigatória.';
    } else if (form.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres.';
    }
    if (!form.placa.trim()) newErrors.placa = 'Placa do veículo é obrigatória.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => { //
    if (!validateForm()) {
      Alert.alert('Erro de Validação', 'Por favor, corrija os campos destacados.');
      return;
    }
    setLoading(true);
    try {
      const result = await cadastrar(form); //
      if (result.success) { //
        Alert.alert('Sucesso', result.message || 'Cadastro realizado com sucesso!'); //
        navigation.navigate('Login'); //
      } else {
        Alert.alert('Erro no Cadastro', result.message || 'Não foi possível realizar o cadastro.'); //
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert('Erro no Cadastro', 'Ocorreu um problema ao tentar realizar o cadastro. Tente novamente.');
    }
    setLoading(false);
  };

  const fieldsConfig = [
    { name: 'username', label: 'Nome de Usuário', icon: 'account', placeholder: 'Seu nome de usuário' },
    { name: 'email', label: 'E-mail', icon: 'email', keyboardType: 'email-address', autoCapitalize: 'none', placeholder: 'seuemail@exemplo.com' },
    { name: 'password', label: 'Senha', icon: 'lock', secureTextEntry: true, placeholder: 'Mínimo 6 caracteres' },
    { name: 'placa', label: 'Placa do Veículo', icon: 'car-info', autoCapitalize: 'characters', placeholder: 'AAA-0000 ou ABC0D12' },
    { name: 'cor', label: 'Cor do Veículo', icon: 'palette', placeholder: 'Ex: Preto, Azul' },
    { name: 'modelo', label: 'Modelo do Veículo', icon: 'car-side', placeholder: 'Ex: Onix, Gol' },
  ];

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Criar Conta" />
      </Appbar.Header>
      {/* Adicionar KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // 'height' pode ser melhor para Android
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Ajuste este valor conforme necessário (altura do header, etc.)
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled" // Para fechar o teclado ao tocar fora dos inputs
        >
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Informações do Usuário
              </Text>
              {fieldsConfig.slice(0, 3).map((field) => (
                <View key={field.name} style={styles.inputContainer}>
                  <TextInput
                    label={field.label}
                    value={form[field.name]}
                    onChangeText={(value) => handleChange(field.name, value)} //
                    secureTextEntry={field.secureTextEntry} //
                    style={styles.inputField}
                    left={<TextInput.Icon icon={field.icon} />}
                    keyboardType={field.keyboardType || 'default'}
                    autoCapitalize={field.autoCapitalize || 'none'}
                    error={!!errors[field.name]}
                    placeholder={field.placeholder}
                  />
                  {errors[field.name] && (
                    <HelperText type="error" visible={!!errors[field.name]}>
                      {errors[field.name]}
                    </HelperText>
                  )}
                </View>
              ))}

              <Text variant="titleLarge" style={[styles.sectionTitle, styles.vehicleTitle]}>
                Informações do Veículo
              </Text>
              {fieldsConfig.slice(3).map((field) => (
                <View key={field.name} style={styles.inputContainer}>
                  <TextInput
                    label={field.label}
                    value={form[field.name]}
                    onChangeText={(value) => handleChange(field.name, value)} //
                    style={styles.inputField}
                    left={<TextInput.Icon icon={field.icon} />}
                    autoCapitalize={field.autoCapitalize || 'sentences'}
                    error={!!errors[field.name]}
                    placeholder={field.placeholder}
                  />
                  {errors[field.name] && (
                    <HelperText type="error" visible={!!errors[field.name]}>
                      {errors[field.name]}
                    </HelperText>
                  )}
                </View>
              ))}
              <Button
                mode="contained"
                onPress={handleSubmit} //
                style={styles.button}
                loading={loading}
                disabled={loading}
                icon="account-plus"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Mantém o conteúdo centralizado se for pequeno
    padding: 16,
  },
  card: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    marginBottom: 16,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  vehicleTitle: {
    marginTop: 24,
  },
  inputContainer: {
    marginBottom: 8,
  },
  inputField: {
    // estilos gerenciados pelo Paper
  },
  button: {
    marginTop: 20,
    paddingVertical: 4,
  },
});