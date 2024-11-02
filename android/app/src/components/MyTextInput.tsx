import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import React from 'react';

// Extend the standard TextInput props
interface Props extends TextInputProps {
  // Add any additional custom props here if needed
}

const MyTextInput: React.FC<Props> = ({...props}) => {
  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholderTextColor="gray"  // Optional: add this if you want consistent placeholder color
        {...props} 
      />
      <View style={styles.border} />
    </View>
  );
};

export default MyTextInput;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
  },
  border: {
    width: '100%',
    backgroundColor: 'gray',
    height: 1,
    alignSelf: 'center',
  },
});