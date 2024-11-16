// Находим контейнер для карточек и шаблон карточки
const cardsContainer = document.querySelector(".places__list");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".places__item");

// Функция создания карточки
function createCard(cardData, deleteCallback) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  // Устанавливаем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Добавляем обработчик на иконку удаления
  deleteButton.addEventListener("click", () => {
    deleteCallback(cardElement);
  });

  return cardElement;
}

// Функция удаления карточки
function deleteCard(cardElement) {
  if (cardElement && cardElement.parentNode) {
    cardElement.remove();
  } else {
    console.error("Элемент не найден для удаления");
  }
}

// Функция для вывода всех карточек
function renderCards(cards) {
  cards.forEach((cardData) => {
    const card = createCard(cardData, deleteCard); 
    cardsContainer.appendChild(card); 
  });
}

// Выводим карточки на страницу
renderCards(initialCards);
