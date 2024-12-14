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
  const [descricao, setDescricao] = useState("");
  const [image, setImage] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editProductId, setEditProductId] = useState(null); 

  useEffect(() => {
    axios
      .get("https://fullstack-react-14jh.onrender.com/api/produto")
      .then((res) => {
        const data = res.data;
        setProducts(data);
        setImage();
      });
  });

  const deleteProductFromBackend = async (id, index) => {
    try {
      // Faz a solicitação DELETE para o backend
      await axios.delete(
        `https://fullstack-react-14jh.onrender.com/api/produto/${id}`
      );

      // Atualiza o estado local para remover o produto
      setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));

      Alert.alert("Sucesso", "Produto deletado com sucesso!");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        "Não foi possível deletar o produto. Tente novamente."
      );
    }
  };

  const sendProductToBackend = async (product) => {
    try {
      const response = await axios.post(
        "https://fullstack-react-14jh.onrender.com/api/produto",
        product
      );
      console.log("Produto enviado:", response.data);

      setProducts((prevProducts) => [...prevProducts, response.data]);

      Alert.alert("Sucesso", "Produto enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar produto:", error);
      Alert.alert(
        "Erro",
        "Não foi possível enviar o produto. Tente novamente."
      );
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

  const addOrUpdateProduct = () => {
    if (!name || !quantity || !descricao) {
      Alert.alert("Erro", "Preencha todos os campos e envie uma imagem");
      return;
    }

    const newProduct = {
      nome: name,
      quantidade: parseInt(quantity),
      descricao: descricao,
      foto: image,
    };

    if (editProductId) {
      axios
        .put(
          `https://fullstack-react-14jh.onrender.com/api/produto/${editProductId}`,
          newProduct
        )
        .then((res) => {
          const updatedProducts = products.map((product) =>
            product._id === editProductId ? res.data : product
          );
          setProducts(updatedProducts);
          setEditProductId(null);
          setName("");
          setQuantity("");
          setDescricao("");
          setImage(null);
          Alert.alert("Sucesso", "Produto atualizado com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao atualizar produto:", error);
          Alert.alert("Erro", "Não foi possível atualizar o produto.");
        });
    } else {
      axios
        .post(
          "https://fullstack-react-14jh.onrender.com/api/produto",
          newProduct
        )
        .then((res) => {
          setProducts([...products, res.data]);
          setName("");
          setQuantity("");
          setDescricao("");
          setImage(null);
          Alert.alert("Sucesso", "Produto adicionado com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao adicionar produto:", error);
          Alert.alert("Erro", "Não foi possível adicionar o produto.");
        });
    }
  };

  const Item = ({ id, nome, descricao, quantidade, foto, index }) => (
    <View style={styles.productItem}>
      {foto && <Image source={{ uri: foto }} style={styles.productImage} />}
      <Text style={styles.productText}>
        {index + 1}. {nome}
      </Text>
      <Text style={styles.productText}>{descricao}</Text>
      <Text style={styles.productText}>Quantidade: {quantidade}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => editProduct(id)} 
          style={[styles.button, styles.editButton]}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteProductFromBackend(id, index)} 
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const editProduct = (id) => {
    const product = products.find((prod) => prod._id === id);
  
    if (product) {
      setName(product.nome);
      setQuantity(product.quantidade.toString()); 
      setDescricao(product.descricao);
      setImage(product.foto); 
      setEditProductId(product._id); 
    } else {
      Alert.alert("Erro", "Produto não encontrado.");
    }
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
          renderItem={({ item, index }) => (
            <Item
              id={item._id} 
              nome={item.nome}
              descricao={item.descricao}
              quantidade={item.quantidade}
              foto={item.foto}
              index={index}
              productId={item._id}
            />
          )}
          keyExtractor={(item) => item._id} 
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
            value={descricao}
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
              {editIndex !== null ? "Atualizar Produto" : "Enviar Produto"}
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
