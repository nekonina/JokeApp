import { StyleSheet, Image, Platform, ScrollView, View, FlatList, Share, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Background from '@/components/Background';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useJokeStore } from '@/hooks/useJokeStore';
import { Button, Card, Dialog, Portal, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { shareFunc } from '@/scripts/share';

export default function FavoriteScreen() {

    const {fav, setFavorites} = useJokeStore()
    const [showModal, setShowModal] = useState(false)
    const [jokeSelected, setJokeSelected] = useState({})

    const setNewFavList = async() => {
        const newFavList = fav.filter(joke => joke.id !== jokeSelected.id )
        setFavorites(newFavList)
        setShowModal(false)
        const user = JSON.parse(await AsyncStorage.getItem("myUser"))
        const updateUser = {...user, fav: newFavList}
        await AsyncStorage.setItem('myUser', JSON.stringify(updateUser))
    }

    const renderItem = ({item}) => (
        <Card style={{marginTop:hp(2.5)}}>
            <Card.Content>
                <Text variant="bodyMedium">{item.value}</Text>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Button 
                        style={styles.favButton}
                        mode={'elevated'}
                        icon={'heart-broken'}
                        onPress={() => {
                            setShowModal(true);
                            setJokeSelected(item);
                        }}
                    >
                        Favorito
                    </Button>
                    <Button 
                        style={styles.favButton}
                        mode={'elevated'}
                        icon={'share-variant'}
                        onPress={() => shareFunc(item.value)}
                    >
                        Compartir
                    </Button>
                </View>
                
            </Card.Content>
        </Card>
    )

  return (
    <Background>
        <ThemedView style={{marginBottom:hp(2), backgroundColor:'transparent'}}>
            <ThemedText type='subtitle' >Favoritos:</ThemedText>
        </ThemedView>
        <FlatList 
            showsVerticalScrollIndicator={false}
            style={{marginBottom:hp(12)}}
            data={fav}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={()=> (
                <Card style={{marginTop:hp(2.5)}}>
                    <Card.Content>
                        <Text variant="bodyMedium" style={{textAlign:'center'}}>No posee ningun chiste guardado</Text>
                    </Card.Content>
                </Card>
            )}
        />
        <Portal>
            <Dialog visible={showModal} onDismiss={() => setShowModal(false)}>
                <Dialog.Content>
                    <Text variant='bodyMedium'>
                        Desea eliminar el siguiente chiste de su lista de favoritos?
                    </Text>
                    <Text variant='labelLarge' style={{marginTop:hp(3)}}>
                        {jokeSelected.value}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setShowModal(false)}>Cancel</Button>
                    <Button onPress={() => setNewFavList()}>Ok</Button>
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
        width:'45%', 
        alignSelf:'flex-end'
    }
});
