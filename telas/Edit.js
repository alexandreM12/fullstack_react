import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
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

    const updatedProduct = {
      nome: name,
      quantidade: parseInt(quantity),
      descricao,
      foto: image,
    };

    try {
      const response = await axios.put(
        `https://fullstack-react-14jh.onrender.com/api/produto/${id}`,
        updatedProduct
      );
      Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      Alert.alert("Erro", "Não foi possível atualizar o produto.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor="#aaa"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        placeholderTextColor="#aaa"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={() => {}} style={styles.imageButton}>
        <Text style={styles.buttonText}>
          {image ? "Trocar Imagem" : "Selecionar Imagem"}
        </Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
      )}
      <TouchableOpacity
        onPress={updateProduct}
        style={styles.imageButton}
      >
        <Text style={styles.buttonText}>
          Atualizar Produto
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 15,
    color: "#333",
  },
  imageButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#ffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
    fontWeight: "bold",
  },
});
