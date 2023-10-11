import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const GiftBoxOpen = () => {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenGiftBox = () => {
    setIsOpened(true);
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        style={[styles.giftBox, isOpened && styles.openedGiftBox]}
        animation={isOpened ? 'bounceIn' : null}
        duration={1000}
      >
        <TouchableOpacity onPress={handleOpenGiftBox}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>打开礼包</Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  giftBox: {
    width: 120,
    height: 120,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  openedGiftBox: {
    width: 120,
    height: 120,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    transform: [{ rotate: '-45deg' }],
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
  },
});

export default GiftBoxOpen;