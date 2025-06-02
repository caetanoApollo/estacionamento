import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
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
import { editarUsuario } from '../services/api'; // Importa a função de edição do usuário da API

// Função para validar o formato do e-mail
const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export default function EditUserScreen({ navigation, route }) {
    const { user } = route.params; // Obtém os dados do usuário dos parâmetros da rota
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '', // Senha é opcional para edição
        placa: '',
        cor: '',
        modelo: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { colors } = useTheme();

    // Efeito para preencher o formulário com os dados do usuário ao carregar a tela
    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || '',
                email: user.email || '',
                password: '', // Não preencher a senha por questões de segurança
                placa: user.placa || '',
                cor: user.cor || '',
                modelo: user.modelo || '',
            });
        }
    }, [user]);

    // Lida com a mudança de valor nos campos do formulário
    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    // Valida os campos do formulário antes de enviar
    const validateForm = () => {
        const newErrors = {};
        if (!form.username.trim()) newErrors.username = 'Nome de usuário é obrigatório.';
        if (!form.email.trim()) {
            newErrors.email = 'E-mail é obrigatório.';
        } else if (!validateEmail(form.email)) {
            newErrors.email = 'Formato de e-mail inválido.';
        }
        // A senha é opcional na edição, valida apenas se for fornecida
        if (form.password && form.password.length < 6) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres se for alterada.';
        }
        if (!form.placa.trim()) newErrors.placa = 'Placa do veículo é obrigatória.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Lida com o envio do formulário de edição
    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Erro de Validação', 'Por favor, corrija os campos destacados.');
            return;
        }
        setLoading(true);
        try {
            const dataToUpdate = { ...form };
            // Remove a senha se estiver vazia para não enviá-la para a API
            if (!dataToUpdate.password) {
                delete dataToUpdate.password;
            }
            const result = await editarUsuario(user.id, dataToUpdate); // Chama a API para editar o usuário
            if (result.success) { // Verifica o sucesso da operação
                Alert.alert('Sucesso', result.message || 'Dados atualizados com sucesso!');
                navigation.goBack(); // Volta para a tela anterior após sucesso
            } else {
                Alert.alert('Erro na Edição', result.message || 'Não foi possível atualizar os dados.'); // Exibe mensagem de erro
            }
        } catch (error) {
            console.error("Erro ao editar usuário:", error);
            Alert.alert('Erro na Edição', 'Ocorreu um problema ao tentar atualizar os dados. Tente novamente.');
        }
        setLoading(false);
    };

    // Configuração dos campos do formulário
    const fieldsConfig = [
        { name: 'username', label: 'Nome de Usuário', icon: 'account', placeholder: 'Seu nome de usuário' },
        { name: 'email', label: 'E-mail', icon: 'email', keyboardType: 'email-address', autoCapitalize: 'none', placeholder: 'seuemail@exemplo.com' },
        { name: 'password', label: 'Senha (Deixe em branco para manter a atual)', icon: 'lock', secureTextEntry: true, placeholder: 'Mínimo 6 caracteres' },
        { name: 'placa', label: 'Placa do Veículo', icon: 'car-info', autoCapitalize: 'characters', placeholder: 'AAA-0000 ou ABC0D12' },
        { name: 'cor', label: 'Cor do Veículo', icon: 'palette', placeholder: 'Ex: Preto, Azul' },
        { name: 'modelo', label: 'Modelo do Veículo', icon: 'car-side', placeholder: 'Ex: Onix, Gol' },
    ];

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Editar Perfil" />
            </Appbar.Header>
            {/* KeyboardAvoidingView para ajustar o layout quando o teclado aparece */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
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
                            {/* Renderiza os campos de usuário (username, email, password) */}
                            {fieldsConfig.slice(0, 3).map((field) => (
                                <View key={field.name} style={styles.inputContainer}>
                                    <TextInput
                                        label={field.label}
                                        value={form[field.name]}
                                        onChangeText={(value) => handleChange(field.name, value)}
                                        secureTextEntry={field.secureTextEntry}
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
                            {/* Renderiza os campos do veículo (placa, cor, modelo) */}
                            {fieldsConfig.slice(3).map((field) => (
                                <View key={field.name} style={styles.inputContainer}>
                                    <TextInput
                                        label={field.label}
                                        value={form[field.name]}
                                        onChangeText={(value) => handleChange(field.name, value)}
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
                                onPress={handleSubmit}
                                style={styles.button}
                                loading={loading}
                                disabled={loading}
                                icon="content-save"
                            >
                                {loading ? 'Salvando...' : 'Salvar Alterações'}
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
        justifyContent: 'center',
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
    button: {
        marginTop: 20,
        paddingVertical: 4,
    },
});