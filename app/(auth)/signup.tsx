import { StyleSheet, Image, Platform, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Background from '@/components/Background';
import { useJokeStore } from '@/hooks/useJokeStore';
import { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getAJoke } from '@/api/getData';
import { Button, Card, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmailRegex, validatePasswordRegex } from '@/scripts/regex';

export default function SignupScreen() {

    const navigation = useNavigation()
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [showModal, setShowModal] = useState(false)

    const [openEye, setOpenEye] = useState(true)

    const signupFunc = async() => {
        
            //Se verifica si existe el correo en la base de usuarios preexistente, de no ser asi se agrega, caso contrario se muestra un mensaje de error
            const dataUsers = JSON.parse(await AsyncStorage.getItem("Users"))

            let updateUsers
            if(!dataUsers){
                updateUsers = [data]
            }else{
                const isIncluded = dataUsers.find(user => user.email === data.email)
                if(!isIncluded){
                    updateUsers = [...dataUsers, data]
                }else{
                    setShowModal(true)
                }
            }
            await AsyncStorage.setItem('Users', JSON.stringify(updateUsers))
            navigation.navigate('index')

    }

     /** Check if the password input is valid
     *
     * @returns {boolean} true if password input is valid, false otherwise
     * */
     const validatePassword = (text: string) => {
        const reg = validatePasswordRegex;
        return reg.test(text);
    };

    /** Check if the email input is valid
     *
     * @returns {boolean} true if email input is valid, false otherwise
     * */
    const validateEmail = (text: string) => {
        const reg = validateEmailRegex;
        return reg.test(text);
    };

    const readyToSend = () => {
        const ready = data.name != '' &&
                        data.email != '' &&
                        data.password != '' &&
                        data.name.length > 3 &&
                        data.password.length >= 6 &&
                        validateEmail(data.email) &&
                        validatePassword(data.password)
        return ready
    }

    return (
        <Background>
            <Button 
                style={styles.back}
                mode={'elevated'}
                icon={'arrow-left'}
                onPress={() => navigation.navigate('index')}
            ></Button>
            <ThemedView style={{marginBottom:hp(2), backgroundColor:'transparent'}}>
                <ThemedText type='subtitle' >Registra tus datos:</ThemedText>
            </ThemedView>
            <Card style={{marginTop:hp(2.5)}}>
                <Card.Content>
                    <TextInput
                        label="Nombre"
                        mode={'outlined'}
                        placeholder='Pedro Perez'
                        value={data.name}
                        onChangeText={text => setData({...data, name: text})}
                    />
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
                        maxLength={15}
                        right={< TextInput.Icon icon={openEye ? 'eye-off' :"eye"} onPress={() => setOpenEye(!openEye)} />}
                        onChangeText={text => setData({...data, password: text})}
                    />
                    <Button 
                        style={styles.favButton}
                        mode={'elevated'}
                        icon={'login'}
                        disabled={!readyToSend()}
                        onPress={() => signupFunc()}
                    >
                        Registrate
                    </Button>
                </Card.Content>
            </Card>
            <Portal>
                <Dialog visible={showModal} onDismiss={() => setShowModal(false)}>
                    <Dialog.Content>
                        <Text variant='bodyMedium'>
                            El correo utilizado ya se encuentra registrado
                        </Text>
                        <Text variant='labelLarge' style={{marginTop:hp(3)}}>
                            Ingrese unos datos diferentes o intente haciendo login
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
    },
    back:{
        alignItems:'center', 
        justifyContent:'center', 
        width:'15%', 
        alignSelf:'flex-start',
        marginBottom:hp(5)

    }
});
