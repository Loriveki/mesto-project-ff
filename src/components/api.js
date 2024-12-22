// Конфигурация API
const config = {
  baseUrl: "https://nomoreparties.co/v1/cohort-mag-4",
  headers: {
    authorization: "24d783c9-4589-4b16-976b-59abee94e07f",
    "Content-Type": "application/json",
  },
};

const API_ENDPOINTS = {
  USER_INFO: "/users/me",
  CARDS: "/cards",
  AVATAR: "/users/me/avatar",
};

// Функция для обработки ответа от сервера
function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return res.json().then((err) => {
    throw new Error(
      `Ошибка: ${res.status} - ${err.message || "Неизвестная ошибка"}`
    );
  });
}

// функция для обработки ошибок
function handleError(error) {
  console.error(`Произошла ошибка: ${error.message}`);
  showErrorToUser(error.message);
}

// функция для отправки запросов
function request(endpoint, options = {}) {
  const finalOptions = {
    headers: { ...config.headers },
    ...options,
  };

  return fetch(`${config.baseUrl}${endpoint}`, finalOptions)
    .then(handleResponse)
    .catch(handleError);
}

// Функция для отображения ошибки пользователю
function showErrorToUser(message) {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = `Произошла ошибка: ${message}`;
  document.body.appendChild(errorMessage);
  setTimeout(() => {
    errorMessage.remove();
  }, 5000);
}

// API функции для работы с пользователем и карточками
export function getUserInfo() {
  return request(API_ENDPOINTS.USER_INFO, { method: "GET" });
}

export function updateUserInfo(name, about) {
  return request(API_ENDPOINTS.USER_INFO, {
    method: "PATCH",
    body: JSON.stringify({ name, about }),
  });
}

export function getCards() {
  return request(API_ENDPOINTS.CARDS, { method: "GET" });
}

export function addCard(name, link) {
  return request(API_ENDPOINTS.CARDS, {
    method: "POST",
    body: JSON.stringify({ name, link }),
  });
}

export function deleteCard(cardId) {
  return request(`${API_ENDPOINTS.CARDS}/${cardId}`, {
    method: "DELETE",
  });
}

export function likeCard(cardId) {
  return request(`${API_ENDPOINTS.CARDS}/${cardId}/likes`, { method: "PUT" });
}

export function dislikeCard(cardId) {
  return request(`${API_ENDPOINTS.CARDS}/${cardId}/likes`, {
    method: "DELETE",
  });
}

export function updateAvatar(avatarUrl) {
  return request(API_ENDPOINTS.AVATAR, {
    method: "PATCH",
    body: JSON.stringify({ avatar: avatarUrl }),
  });
}
