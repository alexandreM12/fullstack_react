import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";

export default function EditScreen({ route, navigation }) {
  const { product } = route.params; // Recebe os dados do produto da navegação
  const [name, setName] = useState(product.nome);
  const [descricao, setDescricao] = useState(product.descricao);
  const [quantidade, setQuantidade] = useState(product.quantidade.toString());

  const handleSave = () => {
    // Lógica para salvar alterações (API ou localmente)
    Alert.alert("Sucesso", "Produto atualizado!");
    navigation.goBack(); // Voltar para a tela anterior
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />
      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />
      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginVertical: 10, fontWeight: "bold" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
});
