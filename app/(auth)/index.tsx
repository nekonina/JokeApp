import { StyleSheet, Image, Platform, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Background from '@/components/Background';
import { useJokeStore } from '@/hooks/useJokeStore';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { getAJoke } from '@/api/getData';
import { Button, Card, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function SigninScreen() {

    const navigation = useNavigation()
    const {setToken} = useAuthStore()
    const {setFavorites} = useJokeStore()
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const [showModal, setShowModal] = useState(false)

    const [openEye, setOpenEye] = useState(true)

    const login = async() => {
        const dataUsers = JSON.parse(await AsyncStorage.getItem("Users"))
        const exist = dataUsers.find(user => user.email === data.email && user.password === data.password)
        if(exist){
            setToken('UsuarioConfirmado/0/')
            await AsyncStorage.setItem('myUser', JSON.stringify(exist))
            setFavorites(dataUsers.fav)
            navigation.navigate('(tabs)')
        }else{
            setShowModal(true)
        }
    }

    return (
        <Background>
            <ThemedView style={{marginBottom:hp(2), backgroundColor:'transparent'}}>
                <ThemedText type='subtitle' >Ingresa tus datos:</ThemedText>
            </ThemedView>
            <Card style={{marginTop:hp(2.5)}}>
                <Card.Content>
                    <TextInput
                        label="Email"
                        mode={'outlined'}
                        placeholder='correo@correo.com'
                        value={data.email}
                        onChangeText={text => setData({...data, email: text})}
                    />
                    <TextInput
                        label="Clave"
                        mode={'outlined'}
                        placeholder='******'
                        secureTextEntry={openEye}
                        value={data.password}
                        right={< TextInput.Icon icon={openEye ? 'eye-off' :"eye"} onPress={() => setOpenEye(!openEye)} />}
                        onChangeText={text => setData({...data, password: text})}
                    />
                    <Button 
                        style={styles.favButton}
                        mode={'elevated'}
                        icon={'login'}
                        onPress={() => login()}
                    >
                        login
                    </Button>
                </Card.Content>
            </Card>
            <ThemedView style={{marginTop:hp(5), backgroundColor:'transparent'}}>
                <ThemedText type='default' style={{textAlign:'center'}}>Si no tienes cuenta registrate</ThemedText>
                <ThemedText type='subtitle' style={{textAlign:'center', textDecorationLine:'underline'}} onPress={() => navigation.navigate('signup')}>AQUI</ThemedText>
            </ThemedView>

            <Portal>
                <Dialog visible={showModal} onDismiss={() => setShowModal(false)}>
                    <Dialog.Content>
                        <Text variant='bodyMedium'>
                            Ha fallado el login
                        </Text>
                        <Text variant='labelLarge' style={{marginTop:hp(3)}}>
                            Rectifique los datos y vuelva a intentarlo
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowModal(false)}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </Background>
    );
}

const styles = StyleSheet.create({
    favButton:{
        alignItems:'center', 
        marginVertical:hp(2), 
        justifyContent:'center', 
        width:'50%', 
        alignSelf:'flex-end'
    }
});
