export default currentDate = () => {
  let day = new Date().getDate();
  let month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  if (month.toString().length === 1) {
    month = `0${month}`
  }

  if (day.toString().length === 1) {
    day = `0${day}`
  }

  const today = `${year}-${month}-${day}`;
  return today
};