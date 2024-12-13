import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [Descricao, setDescricao] = useState("");
  const [image, setImage] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() =>{
    axios.get("")
  })

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

  const addOrUpdateProduct = () => {
    if (!name || !quantity || !Descricao || !image) {
      Alert.alert("Erro", "Preencha todos os campos e envie uma imagem");
      return;
    }

    const newProduct = {
      name,
      quantity: parseInt(quantity),
      Descricao,
      image,
    };

    if (editIndex !== null) {
      const updatedProducts = [...products];
      updatedProducts[editIndex] = newProduct;
      setProducts(updatedProducts);
      setEditIndex(null);
    } else {
      setProducts([...products, newProduct]);
    }

    setName("");
    setQuantity("");
    setDescricao("");
    setImage(null);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.productItem}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      )}
      <Text style={styles.productText}>
        {index + 1}. {item.name}
      </Text>
      <Text style={styles.productText}>Quantidade: {item.quantity}</Text>
      <Text style={styles.productText}>
         {item.Descricao}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => editProduct(index)}
          style={[styles.button, styles.editButton]}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteProduct(index)}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const editProduct = (index) => {
    const product = products[index];
    setName(product.name);
    setQuantity(product.quantity.toString());
    setDescricao(product.Descricao);
    setImage(product.image);
    setEditIndex(index);
  };

  const deleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Estoque de Pedidos</Text>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
        />
        <View style={styles.form}>
          <Text style={styles.subtitle}>
            {editIndex !== null ? "Editar Produto" : "Cadastrar Novo Produto"}
          </Text>
          <TextInput
            placeholder="Nome do Produto"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Descricao"
            style={styles.input}
            value={Descricao}
            onChangeText={setDescricao}
          />
          <TextInput
            placeholder="Quantidade"
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
            <Text style={styles.buttonText}>
              {image ? "Trocar Imagem" : "Selecionar Imagem"}
            </Text>
          </TouchableOpacity>
          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
            </View>
          )}
          <TouchableOpacity
            onPress={addOrUpdateProduct}
            style={styles.addButton}
          >
            <Text style={styles.buttonText}>
              {editIndex !== null ? "Atualizar Produto" : "Adicionar Produto"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f4f9" },
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "white",
  },
  imageButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "white", fontSize: 16 },
  list: { flex: 1, marginBottom: 20 },
  productItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  productText: { fontSize: 16, marginTop: 10 },
  productImage: {
    width: 250,
    height: 200,
    borderRadius: 3,
    alignSelf: "center",
  },
  imageContainer: { alignItems: "center", marginVertical: 10 },
  previewImage: { width: 200, height: 200, borderRadius: 10 },
  addButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 13,
  },
  button: { padding: 10, borderRadius: 5 },
  editButton: { backgroundColor: "#ffc107" },
  deleteButton: { backgroundColor: "#dc3545" },
  form: { marginTop: 10 },
});
