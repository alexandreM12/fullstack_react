import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

import CardMensagem from '../componentes/CardMensagem'
import api from '../services/api';

export default function Cadastro({ navigation }) {

    const [descricao, setDescricao] = useState("");

    function cadastro() {
        try {
            const response = api.post('Create',
                {
                    Descricao: descricao,
                    DataCriacao: new Date()
                });

            setDescricao("");

            navigation.goBack();

        } catch (error) {

        }
    }


    return (
        <View style={styles.container}>

            <View style={styles.container}>
                <Text style={styles.titulo} >Cadastro de produtos!</Text>
            </View>

            <View style={styles.container}>
                <TextInput style={styles.inputCadastro}
                    placeholder="Nome do Produto"
                    onChangeText={text => setDescricao(text)}
                    value={descricao}/> 
            </View>


            <View style={styles.container}>
                <Button style={styles.btnCadastro} onPress={() => cadastro()} title="Salvar" ></Button>
                <StatusBar style="auto" />
            </View>

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo:
    {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },

    btnCadastro:
    {
        backgroundColor: '#fff',
        fontSize: 19,
        marginBottom: 15,
        padding: 7,
        borderRadius: 8,
        width: 280,
        alignItems: 'center',
        alignSelf: 'center'
    },

    inputCadastro:
    {
        borderRadius: 1,
        width: 350,
        border: 'solid 1px gray',
        margin: '20px 5px',
        outline: 'solid 1px silver',
        padding: 4,
        fontSize: 14,
        marginBottom: 10
    },
});