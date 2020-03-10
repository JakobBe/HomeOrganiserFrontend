import { size } from './Size';

const normalFonts = {
  '11': 15,
  'X': 15,
  'Plus': 15,
  '7': 12,
  '5': 10
};

const headerFonts = {
  '11': 18,
  'X': 18,
  'Plus': 18,
  '7': 15,
  '5': 12
};

const buttonFonts = {
  '11': 16,
  'X': 16,
  'Plus': 16,
  '7': 15,
  '5': 12
};

const textStyles = { 
  normalText: {
    fontSize: normalFonts[size],
    letterSpacing: 2,
    color: 'black'
  },

  headerStyle: {
    fontSize: headerFonts[size],
    letterSpacing: 3,
    fontWeight: 'bold',
    color: 'black'
  }
};

export { textStyles };
