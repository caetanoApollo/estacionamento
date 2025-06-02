# ParkReactNative

Sistema de estacionamento com backend Node.js + MySQL e frontend React Native (Expo).

## Como rodar o projeto

### 1. Backend

1. Instale as dependências:
   ```sh
   cd backend
   npm install
   ```
2. Configure o arquivo `.env`:
   ```
   HOST=localhost
   USER=root
   PASSWORD=sua_senha
   DATABASE=estacionamento
   ```
3. Importe o banco de dados:
   ```sh
   mysql -u root -p < db.sql
   ```
4. Inicie o servidor:
   ```sh
   npm start
   ```

### 2. Frontend

1. Instale as dependências:
   ```sh
   cd frontend
   npm install
   ```
2. Inicie o app:
   ```sh
   npm start
   ```
3. Siga as instruções do Expo para rodar no emulador ou dispositivo físico.

## Dependências principais

- Backend: express, mysql2, cors, nodemon
- Frontend: react-native, expo, react-native-paper, react-navigation

## Observações

- O endereço do backend deve ser ajustado em `frontend/src/services/api.jsx` conforme seu IP local.
