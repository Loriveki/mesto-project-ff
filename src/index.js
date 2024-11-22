import "./pages/index.css";
import { createCard, handleLike } from "./components/cards.js";
import { openPopup, closePopup } from "./components/modal.js";

//  Массив с карточками 
const initialCards = [
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

// Общие элементы 
const elements = {
  popups: document.querySelectorAll(".popup"),
  closeButtons: document.querySelectorAll(".popup__close"),
  editButton: document.querySelector(".profile__edit-button"),
  addButton: document.querySelector(".profile__add-button"),
  placesList: document.querySelector(".places__list"),
  editPopup: document.querySelector(".popup_type_edit"),
  addPopup: document.querySelector(".popup_type_new-card"),
  imagePopup: document.querySelector(".popup_type_image"),
  formEditProfile: document.querySelector('.popup__form[name="edit-profile"]'),
  formAddCard: document.querySelector('.popup__form[name="new-place"]'),
  nameInput: document.querySelector(".popup__input_type_name"),
  jobInput: document.querySelector(".popup__input_type_description"),
  profileName: document.querySelector(".profile__title"),
  profileJob: document.querySelector(".profile__description"),
  popupImage: document.querySelector(".popup_type_image .popup__image"),
  popupCaption: document.querySelector(".popup_type_image .popup__caption"),
  placeNameInput: document.querySelector(".popup__input_type_card-name"),
  placeLinkInput: document.querySelector(".popup__input_type_url"),
};

//  Рендеринг карточек 
function renderCards(cardsData) {
  cardsData.forEach((cardData) => {
    const card = createCard(cardData, handleLike, openImagePopup);
    elements.placesList.append(card); 
  });
}

// Функция для открытия попапа с изображением
function openImagePopup(imageSrc, imageAlt) {
  elements.popupImage.src = imageSrc;
  elements.popupImage.alt = imageAlt;
  elements.popupCaption.textContent = imageAlt;
  openPopup(elements.imagePopup);
}

// Обработка формы редактирования профиля
function handleFormEditProfile(evt) {
  evt.preventDefault();
  elements.profileName.textContent = elements.nameInput.value;
  elements.profileJob.textContent = elements.jobInput.value;
  closePopup(elements.editPopup);
}

// Обработка формы добавления новой карточки 
function handleAddCard(evt) {
  evt.preventDefault();
  const cardName = elements.placeNameInput.value;
  const cardLink = elements.placeLinkInput.value;

  const newCard = createCard(
    { name: cardName, link: cardLink },
    handleLike,
    openImagePopup
  );
  elements.placesList.prepend(newCard);
  closePopup(elements.addPopup);
  elements.formAddCard.reset();
}

// функция для добавления обработчиков событий
function addEventListeners() {
  elements.editButton.addEventListener("click", () => {
    elements.nameInput.value = elements.profileName.textContent;
    elements.jobInput.value = elements.profileJob.textContent;
    openPopup(elements.editPopup);
  });

  elements.addButton.addEventListener("click", () =>
    openPopup(elements.addPopup)
  );

  elements.formEditProfile.addEventListener("submit", handleFormEditProfile);
  elements.formAddCard.addEventListener("submit", handleAddCard);

  // Закрытие попапов по оверлею и кнопке 
  elements.popups.forEach((popup) => {
    popup.addEventListener("click", (event) => {
      if (event.target === popup) closePopup(popup);
    });
  });

  elements.closeButtons.forEach((button) => {
    const popup = button.closest(".popup");
    button.addEventListener("click", () => closePopup(popup));
  });
}

// Инициализация приложения 
function initApp() {
  renderCards(initialCards); 
  addEventListeners(); 
}

initApp(); 
