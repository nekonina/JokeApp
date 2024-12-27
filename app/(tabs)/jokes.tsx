import { StyleSheet, Image, Platform, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Background from '@/components/Background';
import { useJokeStore } from '@/hooks/useJokeStore';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { getAJoke } from '@/api/getData';
import { Button, Card, Text } from 'react-native-paper';
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shareFunc } from '@/scripts/share';

export default function JokesScreen() {

    const {jokeType, setFavorites, fav} = useJokeStore()
    const isFocus = useIsFocused()
    const [joke, setJoke] = useState({})

    const getAJokeFunc = async() => {
        if(jokeType != ''){
            const aJoke = await getAJoke(jokeType)
            setJoke(aJoke)
        }
    }

    const isFavFunc = () => {
        if(fav === null){
            return false
        }
        const isFav = fav.find(jokeFav => jokeFav.id === joke.id)
        return isFav
    }

    const setFav = async(newItem) => {
        console.log("🚀 ~ setFav ~ newItem:", newItem)
        
        const dataUser = JSON.parse(await AsyncStorage.getItem("myUser"))

        let newFavList
        if(!fav){
            newFavList = [newItem]
        }else{
            const isIncluded = fav.find(joke => joke.id === newItem.id)
            if(!isIncluded){
                newFavList = [newItem, ...fav]
            }else{
                newFavList = [...fav]
            }
        }
        
        const updateUser = {...dataUser, fav: newFavList}
        await AsyncStorage.setItem('myUser', JSON.stringify(updateUser))
        setFavorites(newFavList);
    }
        
    useEffect(()=>{
        if(isFocus){
            getAJokeFunc()
        }
    }, [isFocus])

  return (
    <Background>
        <ThemedView style={{marginBottom:hp(2), backgroundColor:'transparent'}}>
            <ThemedText type='subtitle' >{jokeType != '' ? 'Mira que chiste te salió:' : 'Regrese al Home para elegir la categoría de su chiste'}</ThemedText>
        </ThemedView>
        <Card style={{marginTop:hp(2.5)}}>
            {
                jokeType != ''
                ?(
                    <Card.Content>
                        <Text variant="bodyMedium">{joke.value}</Text>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Button 
                                style={styles.favButton}
                                mode={ isFavFunc() ? 'contained' : 'elevated'}
                                icon={'heart'}
                                onPress={() => setFav(joke)}
                            >
                                Favorito
                            </Button>
                            <Button 
                                style={styles.favButton}
                                mode={'elevated'}
                                icon={'share-variant'}
                                onPress={() => shareFunc(joke.value)}
                            >
                                Compartir
                            </Button>
                        </View>
                    </Card.Content>
                )
                :(
                    <Card.Content>
                        <Text variant="bodyMedium" style={{textAlign:'center'}}>No ha seleccionado ninguna categoría para buscar un chiste random</Text>
                    </Card.Content>
                )
            }
        </Card>
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
