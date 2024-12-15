import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { View,  Text, TextInput, Button, Alert,TouchableOpacity } from "react-native";
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
    <View>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
        <Text style={styles.buttonText}>
            Selecionar Imagem
        </Text>
      </TouchableOpacity>
      <Button title="Adicionar Produto" onPress={handleAdicionarProduto} />
    </View>
  );
}
export default Cadast;

const styles = StyleSheet.create({
  
});