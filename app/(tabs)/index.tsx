import { Image, StyleSheet, Platform, FlatList, TouchableOpacity, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Background from '@/components/Background';
import { useEffect, useState } from 'react';
import { heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useJokeStore } from '@/hooks/useJokeStore';
import { Button, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function HomeScreen() {

  const {jokes, setJokes, setType, setFavorites, clear} = useJokeStore()
  const navigation = useNavigation()
  const colorScheme = useColorScheme();
  const {setToken} = useAuthStore()
  
  const setJokeSelected = (typeSelected) => {
    setType(typeSelected)
    navigation.navigate("jokes")
  }
  
  const getFav = async() => {
      // await AsyncStorage.clear()
      const data = JSON.parse(await AsyncStorage.getItem("myUser"))
      setFavorites(data.fav ?? [])
  }

  const signout = async() => {
    const user = JSON.parse(await AsyncStorage.getItem("myUser"))
    const dataUsers = JSON.parse(await AsyncStorage.getItem("Users"))
    const updateUsers = dataUsers.map(userInfo => {
      if(userInfo.email === user.email){
        return user
      }else{
        return userInfo
      }
    })
    await AsyncStorage.setItem('Users', JSON.stringify(updateUsers))
    
    if(user){
      await AsyncStorage.removeItem('myUser')
      setToken(null)
      clear()
      navigation.navigate('(auth)')
    }
  }

  useEffect(()=>{
    setJokes()
    getFav()
  }, [])

  const renderItem = ({ item }) => (
      <Button 
        contentStyle={{flex:1,borderWidth:1}}
        style={{flex:1, alignItems:'center', marginBottom:hp(2), justifyContent:'center'}}
        dark={true}
        uppercase={true}
        mode='outlined'
        onPress={() => setJokeSelected(item)}
      >
        {item}
      </Button>
  )

  return (
    <Background>
      <TouchableOpacity style={{alignSelf:'flex-end', borderWidth:1}} onPress={() => signout()}>
        <Icon source={'exit-run'} size={25} color={colorScheme === 'dark' ? 'white' : 'purple'}/>
      </TouchableOpacity>
      <ThemedView style={{marginBottom:hp(2), backgroundColor:'transparent'}}>
           
            <ThemedText type='subtitle' >Home</ThemedText>
        </ThemedView>
      <FlatList 
          showsVerticalScrollIndicator={false}
          style={{marginTop: hp(1.5), marginBottom:hp(12)}}
          data={jokes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
    </Background>
  );
}

const styles = StyleSheet.create({
  
});
