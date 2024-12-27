import { Alert, Share } from "react-native";

export const shareFunc = async(joke) => {
    try {
        const result = await Share.share({
          message: `Un chiste: ${joke}`,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error: any) {
        Alert.alert(error.message);
      }
}