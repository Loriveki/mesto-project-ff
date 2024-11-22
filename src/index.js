import "./pages/index.css";
import {
  initialCards,
  createCard,
  handleLike,
  handleDelete,
} from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";

// Общие элементы
const elements = {
  popups: document.querySelectorAll(".popup"),
  closeButtons: document.querySelectorAll(".popup__close"),
  editButton: document.querySelector(".profile__edit-button"),
  addButton: document.querySelector(".profile__add-button"),
  placesList: document.querySelector(".places__list"), // Здесь
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
    openImagePopup,
    handleDelete
  );
  elements.placesList.prepend(newCard);
  closePopup(elements.addPopup);
  elements.formAddCard.reset();
}

// Функция для добавления всех обработчиков событий
function addEventListeners() {
  elements.editButton.addEventListener("click", openEditProfilePopup);
  elements.addButton.addEventListener("click", openAddCardPopup);
  elements.formEditProfile.addEventListener("submit", handleFormEditProfile);
  elements.formAddCard.addEventListener("submit", handleAddCard);

  // Закрытие попапов по оверлею и кнопке
  elements.popups.forEach((popup) => {
    popup.addEventListener("click", closePopupHandler);
  });

  elements.closeButtons.forEach((button) => {
    button.addEventListener("click", () => closeButtonHandler(button));
  });
}

// Функции для открытия попапов и закрытия попапов
function openEditProfilePopup() {
  elements.nameInput.value = elements.profileName.textContent;
  elements.jobInput.value = elements.profileJob.textContent;
  openPopup(elements.editPopup);
}

function openAddCardPopup() {
  openPopup(elements.addPopup);
}

function closePopupHandler(event) {
  if (event.target === event.currentTarget) {
    closePopup(event.currentTarget);
  }
}

function closeButtonHandler(button) {
  const popup = button.closest(".popup");
  closePopup(popup);
}

// Рендеринг карточек
function renderCards(cardsData) {
  cardsData.forEach((cardData) => {
    const card = createCard(cardData, handleLike, openImagePopup, handleDelete);
    elements.placesList.append(card);
  });
}

// Инициализация приложения
function initApp() {
  renderCards(initialCards);
  addEventListeners();
}

initApp();
