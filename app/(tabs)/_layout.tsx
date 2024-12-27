import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { hand, laugh, search, surprice } from '@/assets/icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Portal } from 'react-native-paper';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Portal.Host>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Image source={surprice} style={[styles.index,{ tintColor: color}]} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Busqueda',
            tabBarIcon: ({ color }) => <Image source={search} style={[styles.search,{ tintColor: color}]} />,
          }}
        />
        <Tabs.Screen
          name="jokes"
          options={{
            title: 'Chistes',
            tabBarIcon: ({ color }) => <Image source={laugh} style={[styles.index,{ tintColor: color}]} />,
          }}
        />
        <Tabs.Screen
          name="favorite"
          options={{
            title: 'Favoritos',
            tabBarIcon: ({ color }) => <Image source={hand} style={[styles.index,{ tintColor: color}]} />,
          }}
        />
      </Tabs>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  index : {
    height: hp(4),
    width: hp(4),
    resizeMode:'contain',
  },
  search : {
    height: hp(3.3),
    width: hp(3.3),
    resizeMode:'contain',
  },
})
