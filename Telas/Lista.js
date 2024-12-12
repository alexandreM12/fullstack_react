import { StatusBar } from 'expo-status-bar';
import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import CardMensagem from '../componentes/CardMensagem'
import api from '../servicos/api';


// Função principal do aplicativo.
export default function Lista(navigation) {

  const [produtos, setProd] = useState([]);

  // useEffect é usado para realizar uma ação assim que o componente é montado.
  useEffect(() => {
    // Faz uma requisição à API para buscar os produtos.
    api.get('Lista').then(({ data }) => {
        // Atualiza o estado "produtos" com os dados retornados da API.
        setProd(data);
      })
      .catch(error => {
        // Caso ocorra um erro na requisição, ele será exibido no console.
        console.error(error);
      });
  }, []); // O array vazio garante que esse efeito seja executado apenas uma vez ao montar o componente.

  // Renderiza o componente.
  return (
    <View style={styles.container}>
        <Button style={styles.btnProduto} title="Cadastro de Produtos novos"
        onPress={() => navigation.navigate("Cadastro")}/>

      <Text style= {styles.titulo}> Estoque de Produtos</Text>

      {produtos.map(item=>
        (
          <CardMensagem key={item.codigo} descricao={item.Descricao}/> 
        ))}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo:
  {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom:10
  },
  btnProduto:
  {
    borderRadius: 100
  }
});
