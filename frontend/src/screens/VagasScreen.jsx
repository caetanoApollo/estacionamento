import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, Alert, View, RefreshControl } from 'react-native';
import {
  Card,
  Text,
  Button,
  ActivityIndicator,
  Appbar,
  Chip,
  useTheme,
  Divider,
  Dialog,
  Portal,
  IconButton,
} from 'react-native-paper';
import { listarVagas, ocuparVaga, desocuparVaga } from '../services/api'; // Importa funções da API


export default function VagasScreen({ route, navigation }) {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState(null);
  const [actionType, setActionType] = useState('');

  const user = route.params?.user; // Obtém os dados do usuário dos parâmetros da rota
  const userId = user?.id;
  const { colors } = useTheme();

  // Função para buscar as vagas na API
  const fetchVagas = useCallback(async () => {
    console.log("Buscando vagas...");
    setLoading(true);
    try {
      const result = await listarVagas(); // Chama a API para listar vagas
      if (result.success && result.vagas) { // Verifica o sucesso da operação
        console.log("Vagas recebidas:", JSON.stringify(result.vagas.slice(0, 2), null, 2));
        setVagas(result.vagas);
      } else {
        Alert.alert('Erro ao Carregar Vagas', result.message || 'Não foi possível obter os dados das vagas.');
        console.error("Erro ao listar vagas, resultado da API:", result);
        setVagas([]);
      }
    } catch (error) {
      console.error("Erro crítico ao buscar vagas:", error);
      Alert.alert('Erro Crítico', 'Ocorreu um problema de rede ou no servidor ao buscar as vagas.');
      setVagas([]);
    }
    setLoading(false);
  }, []);

  // Função para atualizar as vagas (pull-to-refresh)
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchVagas();
    setRefreshing(false);
  }, [fetchVagas]);

  // Efeito para configurar o cabeçalho da tela e buscar as vagas
  useEffect(() => {
    if (user && userId) {
      console.log("Usuário logado (VagasScreen):", JSON.stringify(user, null, 2));
      console.log("ID do Usuário (VagasScreen):", userId);
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            {/* Ícone para editar perfil */}
            <IconButton
              icon="account-edit"
              iconColor={'#000000'}
              size={24}
              onPress={() => {
                navigation.navigate('EditUser', { user: user }); // Navega para a tela de edição, passando o usuário
              }}
            />
            {/* Ícone para logout */}
            <IconButton
              icon="logout"
              iconColor={'#000000'}
              size={24}
              onPress={() => {
                navigation.replace('Login'); // Redireciona para a tela de Login
              }}
            />
          </View>
        ),
        title: `Vagas - ${user?.username || 'Usuário'}`,
        headerLeft: () => null, // Remove o botão de voltar padrão
        headerTitleAlign: 'center',
      });
      fetchVagas();
    } else {
      console.warn("Usuário não encontrado em route.params. Navegando para Login.");
      Alert.alert("Sessão inválida", "Por favor, faça login novamente.");
      navigation.replace('Login');
    }
  }, [fetchVagas, navigation, user, userId, colors.onPrimary]);

  // Exibe o diálogo de confirmação
  const showDialog = (vaga, type) => {
    setSelectedVaga(vaga);
    setActionType(type);
    setDialogVisible(true);
  };

  // Esconde o diálogo de confirmação
  const hideDialog = () => {
    setDialogVisible(false);
    setSelectedVaga(null);
    setActionType('');
  };

  // Lida com a confirmação da ação (ocupar ou desocupar vaga)
  const handleConfirmAction = async () => {
    if (!selectedVaga || !userId) {
      Alert.alert('Erro', 'Informações da vaga ou usuário ausentes.');
      hideDialog();
      return;
    }

    setLoading(true);
    let result;
    try {
      if (actionType === 'ocupar') {
        result = await ocuparVaga(selectedVaga.id, userId); // Chama a API para ocupar vaga
      } else if (actionType === 'desocupar') {
        result = await desocuparVaga(selectedVaga.id); // Chama a API para desocupar vaga
      }

      if (result && result.success) { // Verifica o sucesso da operação
        Alert.alert('Sucesso!', result.message || `Vaga ${actionType === 'ocupar' ? 'ocupada' : 'desocupada'} com sucesso.`);
      } else {
        Alert.alert('Falha na Operação', result ? result.message : `Não foi possível ${actionType} a vaga.`);
        console.error("Falha na API:", result);
      }

    } catch (error) {
      console.error(`Erro ao ${actionType} vaga:`, error);
      Alert.alert('Erro na Operação', `Ocorreu um problema de rede ou no servidor ao tentar ${actionType} a vaga.`);
    }

    hideDialog();
    setLoading(false);
    fetchVagas(); // Atualiza a lista de vagas após a operação
  };

  // Renderiza cada item da lista de vagas
  const renderItem = ({ item }) => {
    console.log(`Renderizando vaga ID: ${item.id}, Disponível: ${item.disponivel}, Ocupante ID: ${item.ocupante_id}, UserID Logado: ${userId}`);
    const isOcupadaPeloUsuarioAtual = !item.disponivel && item.ocupante_id === userId;
    console.log(`Vaga ID ${item.id} - Pode desocupar? ${isOcupadaPeloUsuarioAtual}`);

    return (
      <Card style={styles.card}>
        <Card.Title
          title={`Vaga ${item.numero || item.id}${item.bloco ? ` - Bloco ${item.bloco}` : ''}`}
          titleVariant="titleMedium"
          subtitle={item.preferencial || item.preferencial_int ? 'Preferencial' : 'Comum'}
          left={(props) =>
            <Chip
              {...props}
              icon={item.disponivel ? "lock-open-variant-outline" : "lock-outline"}
              selectedColor={item.disponivel ? colors.primary : colors.error}
              selected={!item.disponivel}
              style={{ padding: 2 }}
            >
              {item.disponivel ? 'Livre' : 'Ocupada'}
            </Chip>
          }
        />
        {!item.disponivel && item.ocupante_id && (
          <Card.Content>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              {item.ocupante_id === userId ? "Ocupada por você" : `Ocupada por ID: ${item.ocupante_id}`}
            </Text>
          </Card.Content>
        )}
        <Divider style={{ marginVertical: 8 }} />
        <Card.Actions style={styles.cardActions}>
          {item.disponivel ? (
            <Button
              icon="arrow-down-bold-box"
              mode="contained"
              onPress={() => showDialog(item, 'ocupar')}
              disabled={loading}
              style={styles.actionButton}
            >
              Ocupar
            </Button>
          ) : (
            isOcupadaPeloUsuarioAtual ? (
              <Button
                icon="arrow-up-bold-box-outline"
                mode="outlined"
                onPress={() => showDialog(item, 'desocupar')}
                disabled={loading}
                textColor={colors.error}
                borderColor={colors.error}
                style={styles.actionButton}
              >
                Desocupar
              </Button>
            ) : (
              <Button disabled mode="outlined" style={styles.actionButton}>
                Ocupada
              </Button>
            )
          )}
        </Card.Actions>
      </Card>
    );
  };

  // Exibe um indicador de carregamento se as vagas estiverem sendo carregadas pela primeira vez
  if (loading && vagas.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator animating={true} size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.onSurface }}>Carregando vagas...</Text>
      </View>
    );
  }

  return (
    <>
      {/* Lista de vagas */}
      <FlatList
        data={vagas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text variant="headlineSmall">Nenhuma vaga encontrada.</Text>
              <Button onPress={onRefresh} mode="text" style={{ marginTop: 10 }}>
                Tentar Novamente
              </Button>
            </View>
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      />
      {/* Portal para o diálogo de confirmação */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>
            {actionType === 'ocupar' ? 'Confirmar Ocupação' : 'Confirmar Desocupação'}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Você tem certeza que deseja {actionType === 'ocupar' ? `ocupar a vaga #${selectedVaga?.numero || selectedVaga?.id}` : `desocupar a vaga #${selectedVaga?.numero || selectedVaga?.id}`}?
            </Text>
            {(actionType === 'ocupar' && (selectedVaga?.preferencial || selectedVaga?.preferencial_int === 1)) && (
              <Text variant="bodySmall" style={{ color: colors.error, marginTop: 8 }}>
                Atenção: Esta é uma vaga preferencial.
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} textColor={colors.onSurfaceVariant}>Cancelar</Button>
            <Button
              onPress={handleConfirmAction}
              mode="contained"
              loading={loading && selectedVaga?.id === (selectedVaga?.id)}
              disabled={loading && selectedVaga?.id === (selectedVaga?.id)}
            >
              Confirmar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 8,
    paddingBottom: 16,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
});