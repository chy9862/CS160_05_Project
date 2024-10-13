import { StyleSheet } from "react-native";
import { Image } from "expo-image";

type Props = {
  imgSource: string;
  selectedImage?: string;
};

export default function ImageViewer({ imgSource,selectedImage }: Props) {
    return (
        <Image
          source={selectedImage ? { uri: selectedImage } : imgSource} // Use selectedImage if available
          style={styles.image}
        />
      );
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});