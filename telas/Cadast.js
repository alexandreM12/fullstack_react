import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const Cadast = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [foto, setFoto] = useState("");

  const handleAdicionarProduto = async () => {
    if (!nome || !descricao || !quantidade || !foto) {
      Alert.alert("Preencha todos os campos, incluindo a imagem!");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("quantidade", parseInt(quantidade));
    formData.append("foto", {
      uri: foto,
      name: "produto.jpg",
      type: "image/jpeg",
    });

    try {
      await axios.post(
        "https://fullstack-react-14jh.onrender.com/api/produto",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Alert.alert("Produto Adicionado!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro ao adicionar produto", error.message);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão Negada",
        "Você precisa permitir o acesso à galeria."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (

      <View style={styles.container}>
        <Text style={styles.title}>Cadastro de Produto</Text>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do Produto"
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
        />
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          placeholderTextColor="#aaa"
          value={descricao}
          onChangeText={setDescricao}
        />
        <Text style={styles.label}>Quantidade</Text>
        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          placeholderTextColor="#aaa"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.buttonText}>Selecionar Imagem</Text>
        </TouchableOpacity>
        <Button title="Adicionar Produto" onPress={handleAdicionarProduto} />
      </View>
  );
};
export default Cadast;

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
  