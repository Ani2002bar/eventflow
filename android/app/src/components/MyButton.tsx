import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
    onPress: () => void;
    title: string
}

const MyButton: FC<Props> = ({onPress, title}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={['#4C68D7', '#8E44AD']} // Blue to violet gradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradient}
      >
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

export default MyButton

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: "100%",
        borderRadius: 30,
        overflow: 'hidden' // This ensures the gradient respects the border radius
    },
    gradient: {
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: "white",
        fontSize: 20,
        fontFamily: "Redressed-Regular"
    }
})