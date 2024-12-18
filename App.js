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
import Cadast from "./telas/Cadast";
import Edit from "./telas/Edit";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";

function Home() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [descricao, setDescricao] = useState("");
  const [image, setImage] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get("https://fullstack-react-14jh.onrender.com/api/produto")
      .then((res) => {
        const data = res.data;
        setProducts(data);
        setImage();
        setFilteredProducts(data);
      })
      .catch((error) => console.error("Erro ao buscar produtos:", error));
  }, [products]);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.nome.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchText, products]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const deleteProductFromBackend = async (id) => {
    try {
      await axios.delete(
        `https://fullstack-react-14jh.onrender.com/api/produto/${id}`
      );

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
      setFilteredProducts((prevFiltered) =>
        prevFiltered.filter((product) => product._id !== id)
      );

      Alert.alert("Sucesso", "Produto deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
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

  const Item = ({ id, nome, descricao, quantidade, foto, index }) => (
    <View style={styles.productItem}>

    {foto && (
      <View style={styles.imageContainer}>
        <Image source={{ uri: `${foto}` }} style={styles.productImage} />
      </View>
    )}
    <Text style={styles.productName}>
      {index + 1}. {nome}
    </Text>

    <View style={styles.infoContainer}>
      <Text style={styles.infoTitle}>Descrição:</Text>
      <Text style={styles.infoText}>{descricao}</Text>
    </View>

    <View style={styles.infoContainer}>
      <Text style={styles.infoTitle}>Quantidade:</Text>
      <Text style={styles.infoText}>{quantidade}</Text>
    </View>
  

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => {
            editProduct(id);
            navigation.navigate("Edit", { id });
          }}
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
        <Text style={styles.title}>Lista dos produtos</Text>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Pesquisar produtos..."
            value={searchText}
            onChangeText={handleSearch}
          />
          <TouchableOpacity>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredProducts}
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
        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => navigation.navigate("Cadast")}
        >
          <Text style={styles.buttonText}>Novo Produto</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Edit" component={Edit} />
        <Stack.Screen name="Cadast" component={Cadast} />
      </Stack.Navigator>
    </NavigationContainer>
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
    backgroundColor: "fff",
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
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    alignSelf: "center",
    resizeMode: "cover",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 13,
  },
  button: { padding: 10, borderRadius: 5 },
  editButton: { backgroundColor: "#ffc107" },
  deleteButton: { backgroundColor: "#dc3545" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  searchIcon: {
    fontSize: 20,
  },
  infoContainer: {
    borderRadius: 10,
    padding: 10, 
    marginVertical: 8,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600", 
    color: "#34495e", 
    marginBottom: 5, 
  },
  infoText: {
    fontSize: 14, 
    color: "#555", 
    lineHeight: 20, 
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50", 
    textAlign: "center",
    marginBottom: 1,
    marginTop: 10,
  },
});
