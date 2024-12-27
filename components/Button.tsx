import { StyleSheet, Image, Platform, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Background({children}) {
  return (
    <SafeAreaView>
      <View style={styles.space}>
        <ScrollView style={styles.usedSpace}>
            {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  space:{
    marginHorizontal: hp(5),
    marginTop: hp(5),
  },
  usedSpace:{
    width:'100%',
    height:'100%',
  }
});
