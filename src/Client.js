const baseUrl = 'http://localhost:3001/'
// https://home-organiser.herokuapp.com/

export const createToDo = async (newToDo, appointee, selectedDate, userId) => {
  return fetch(`${baseUrl}to_dos?task=${newToDo}&appointee=${appointee}&date=${selectedDate}&user_id=${userId}`, {
    method: 'post'
  });
};

export const deleteToDo = async (id) => {
  return fetch(`${baseUrl}to_dos/${id}`, {
    method: 'delete'
  });
};

export const fetchToDos = async (userId) => {
  return fetch(`${baseUrl}to_dos?user_id=${userId}`, {
    method: 'get'
  });
};

export const fetchUserToDos = async (userId) => {
  return fetch(`${baseUrl}to_dos/user/${userId}`, {
    method: 'get'
  });
}

export const updateToDo = async (id) => {
  return fetch(`${baseUrl}to_dos/${id}`, {
    method: 'put'
  });
}

export const deleteEvent = async (id) => {
  return fetch(`${baseUrl}events/${id}`, {
    method: 'delete'
  });
};

export const updateEvent = async (text, id) => {
  return fetch(`${baseUrl}events/${id}?text=${text}`, {
    method: 'put'
  });
}

export const fetchEvents = async (userId) => {
  return fetch(`${baseUrl}events?user_id=${userId}`, {
    method: 'get'
  });
};

export const createNewEvent = async (selectedDate, text, userId, time) => {
  return fetch(`${baseUrl}events?date=${selectedDate}&text=${text}&user_id=${userId}&time=${time}`, {
    method: 'post'
  });
};

export const createSession = async (email, password) => {
  return fetch(`${baseUrl}login?email=${email}&password=${password}`, {
    method: 'get'
  });
};

export const createUser = async (email, password, name) => {
  return fetch(`${baseUrl}signup?email=${email}&password=${password}&name=${name}`, {
    method: 'get'
  });
};

export const createShoppingItem = async (newShoppingItem, userId) => {
  return fetch(`${baseUrl}shopping_items?name=${newShoppingItem}&user_id=${userId}`, {
    method: 'post'
  });
};

export const deleteShoppingItem = async (id) => {
  return fetch(`${baseUrl}shopping_items/${id}`, {
    method: 'delete'
  });
};

export const fetchShoppingItems = async (userId) => {
  return fetch(`${baseUrl}shopping_items?user_id=${userId}`, {
    method: 'get'
  });
};

export const updateShoppingItem = async (id, name, price, userId) => {
  return fetch(`${baseUrl}shopping_items/${id}?name=${name}&price=${price}&user_id=${userId}`, {
    method: 'put'
  });
};

export const filterToDos = async (filter, userId) => {
  return fetch(`${baseUrl}to_dos/${filter}/user/${userId}`, {
    method: 'get'
  });
}

export const getHome = async (id) => {
  return fetch(`${baseUrl}home/${id}`, {
    method: 'get'
  });
}

export const updateUserColor = async (id, color) => {
  return fetch(`${baseUrl}users/${id}?color=${color}`, {
    method: 'put'
  });
}

export const updateUserPayPalMeLink = async (id, link) => {
  return fetch(`${baseUrl}users/${id}?link=${link}`, {
    method: 'put'
  });
}

export const createExpense = async (id, amount, items) => {
  return fetch(`${baseUrl}expenses/?user_id=${id}&amount=${amount}`, {
    method: 'post',
    body: JSON.stringify({
      items
    })
  });
}

export const fetchExpenses = async (home_id) => {
  return fetch(`${baseUrl}expenses?home_id=${home_id}`, {
    method: 'get'
  });
}