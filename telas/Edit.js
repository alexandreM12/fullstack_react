import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { StyleSheet } from "react-native";
import axios from "axios";

const Edit = ({ route, navigation }) => {
  const { id } = route.params;  
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [descricao, setDescricao] = useState("");
  const [image, setImage] = useState(null);

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const response = await axios.get(`https://fullstack-react-14jh.onrender.com/api/produto/${id}`);
  //       const product = response.data;
  //       setName(product.nome);
  //       setQuantity(product.quantidade.toString());
  //       setDescricao(product.descricao);
  //       setImage(product.foto);
  //     } catch (error) {
  //       console.error("Erro ao carregar produto", error);
  //       Alert.alert("Erro", "Não foi possível carregar os dados do produto.");
  //     }
  //   };

  //   fetchProduct();
  // }, [id]);

  const updateProduct = async () => {
    if (!name || !quantity || !descricao) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const updatedProduct = { nome: name, quantidade: parseInt(quantity), descricao, foto: image };

    try {
      const response = await axios.put(`https://fullstack-react-14jh.onrender.com/api/produto/${id}`, updatedProduct);
      Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      navigation.goBack(); 
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      Alert.alert("Erro", "Não foi possível atualizar o produto.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Editar Produto</Text>
      <TextInput
        placeholder="Nome do Produto"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Descrição"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        placeholder="Quantidade"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TouchableOpacity
        onPress={() => {
        }}
        style={{ backgroundColor: "#ddd", padding: 10, marginBottom: 20 }}
      >
        <Text style={{ textAlign: "center" }}>{image ? "Trocar Imagem" : "Selecionar Imagem"}</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
      <TouchableOpacity
        onPress={updateProduct}
        style={{ backgroundColor: "#28a745", padding: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Atualizar Produto</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Edit;

const styles = StyleSheet.create({
  
});
