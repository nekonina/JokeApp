import { StyleSheet, Image, Platform, ScrollView, View, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Background from '@/components/Background';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from 'react';
import { Button, Card, Searchbar, Text } from 'react-native-paper';
import { searchJokes } from '@/api/getData';
import { useJokeStore } from '@/hooks/useJokeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { search } from '@/assets/icons';
import { shareFunc } from '@/scripts/share';

export default function ExplorerScreen() {

  const {setFavorites, fav} = useJokeStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [listOfJokes, setListOfJokes] = useState({
    result: [],
    total: 0
  })

  const getListJoke = async() => {
    const newList = await searchJokes(searchQuery)
    setListOfJokes(newList)
  }

  const isFavFunc = (item) => {
    if(fav === null){
        return false
    }
    const isFav = fav.find(jokeFav => jokeFav.id === item)
    return isFav
}

const setFav = async(newItem) => {
    
    const data = JSON.parse(await AsyncStorage.getItem("myUser"))

    let newFavList
    if(!fav){
        newFavList = [newItem]
    }else{
        const isIncluded = fav.find(joke => joke.id.toString() === newItem.id.toString())
        if(!isIncluded){
            newFavList = [newItem, ...fav]
        }else{
            newFavList = [...fav]
        }
    }
    
    const updateUser = {...data, fav: newFavList}
    await AsyncStorage.setItem('myUser', JSON.stringify(updateUser))
    setFavorites(newFavList);
}

const setNewFavList = async(jokeSelected) => {
  const newFavList = fav.filter(joke => joke.id !== jokeSelected )
  setFavorites(newFavList)
  setShowModal(false)
  await AsyncStorage.setItem('Fav', JSON.stringify(newFavList))
}

  const renderItem = ({item}) => (
    <Card style={{marginTop:hp(2.5)}}>
        <Card.Content>
            <Text variant="bodyMedium">{item.value}</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Button 
                  style={styles.favButton}
                  mode={ isFavFunc(item.id) ? 'contained' : 'elevated'}
                  icon={ isFavFunc(item.id) ? 'heart-broken' :'heart'}
                  onPress={isFavFunc(item.id) 
                            ?() => setNewFavList(item.id)
                            :() => setFav(item)}
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
      <ThemedView style={{marginBottom: hp(2), backgroundColor:'transparent'}}>
          <ThemedText type='subtitle' >Busquemos un chiste:</ThemedText>
      </ThemedView>
      <Searchbar
        placeholder="busquemos..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onIconPress={() => getListJoke()}
        onClearIconPress={() => setListOfJokes({
          result: [],
          total: 0
        })}
        icon={search}
      />
      {
        listOfJokes.total != 0
        ?(
          <ThemedView style={{marginVertical: hp(2), backgroundColor:'transparent'}}>
            <ThemedText type='defaultSemiBold' >{`Hemos encontrados ${listOfJokes.total} coincidencias:`}</ThemedText>
        </ThemedView>
        ):null
      }
      
      <FlatList 
          showsVerticalScrollIndicator={false}
          style={{marginBottom:hp(10),height:hp(67)}}
          data={listOfJokes.result}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={()=> (
              <Card style={{marginTop:hp(2.5)}}>
                  <Card.Content>
                      <Text variant="bodyMedium" style={{textAlign:'center'}}>Aun no has buscado ningun chiste</Text>
                  </Card.Content>
              </Card>
          )}
      />
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
