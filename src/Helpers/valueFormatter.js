import moment from 'moment';

export const valueFormatter = (value, format) => {
  let currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
  let formattedValue = '';

  switch (format) {
    case 'Age':
      formattedValue = `${value}`
      break;
    case '% str':
      formattedValue = `${(value * 100).toFixed(2).replace('.', ',')} %`;
      break;
    case '%':
      formattedValue = `${value} %`;
      break;
    case '% p.a.':
      formattedValue = `${value / 10}% p.a.`;
      break;
    case 'EUR':
      formattedValue = currencyFormatter.format(value);
      break;
    case 'inYears':
      formattedValue = `in ${value} Jahren`;
      break;
    case 'years':
      formattedValue = `${value} Jahre`;
      break;
    case 'day':
      formattedValue = `${moment.utc(value).format('DD.MM.YYYY')}`;
      break;
  }

  return formattedValue;
}