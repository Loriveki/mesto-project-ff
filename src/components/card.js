export const initialCards = [
  {
    name: "Архыз",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
  },
  {
    name: "Челябинская область",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
  },
  {
    name: "Иваново",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
  },
  {
    name: "Камчатка",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
  },
  {
    name: "Холмогорский район",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
  },
  {
    name: "Байкал",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
  },
];

// Функция для создания элемента карточки
function createCardElement() {
  const cardTemplate = document.querySelector("#card-template").content;
  return cardTemplate.cloneNode(true).querySelector(".card");
}

// Функция для создания карточки
export function createCard(
  cardData,
  handleLike,
  handleImageClick,
  handleDelete
) {
  const cardElement = createCardElement();
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  likeButton.addEventListener("click", () => handleLike(likeButton));
  if (handleImageClick) {
    cardImage.addEventListener("click", () =>
      handleImageClick(cardData.link, cardData.name)
    );
  }

  deleteButton.addEventListener("click", () => handleDelete(cardElement));

  return cardElement;
}

// Функция обработки лайка
export function handleLike(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

// Функция удаления карточки
export function handleDelete(cardElement) {
  cardElement.remove();
}
