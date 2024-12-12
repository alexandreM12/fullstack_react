import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CardMensagem from './componentes/CardMensagem'
import api from './services/api';
import Cadastro from './views/Cadastro';
import Lista from './views/Lista';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Lista de Produtos"
          component={Lista}
          options={{ title: 'Produtos' }}
        />
        <Stack.Screen name="Lista" component={Lista} />

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ title: 'Cadastro' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

