import React from 'react';
import { Button } from './Button';
import { colorPalette } from '../../Style/Colors';

const AddButton = (props) => {
  return (
    <Button 
      onPress={props.onPress} 
      additionalButtonStyles={[styles.addButtonStyle, props.additionalButtonStyles]}
      additionalButtonTextStyles={styles.additionalButtonTextStyles}
    >
      +
    </Button>
  );
}

const styles = {
  addButtonStyle: {
    backgroundColor: colorPalette.secondary,
    marginTop: 5,
    height: 35,
    width: 35,
    borderRadius: 35 / 2
  },

  additionalButtonTextStyles: {
    padding: 0,
    paddingTop: 8
  }
}

export { AddButton };