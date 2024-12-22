import "./pages/index.css";
import { createCard } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getUserInfo,
  updateUserInfo,
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
  updateAvatar,
} from "./components/api.js";

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
  profileAvatar: document.querySelector(".profile__image img"),
  popupImage: document.querySelector(".popup_type_image .popup__image"),
  popupCaption: document.querySelector(".popup_type_image .popup__caption"),
  placeNameInput: document.querySelector(".popup__input_type_card-name"),
  placeLinkInput: document.querySelector(".popup__input_type_url"),
  deletePopup: document.querySelector("#delete-popup"),
  deleteConfirmButton: document.querySelector(
    "#delete-popup .popup__confirm-button"
  ),
  avatarPopup: document.querySelector(".popup_type_avatar"),
  avatarForm: document.querySelector('.popup__form[name="avatar-form"]'),
  avatarInput: document.querySelector(".popup__input_type_avatar"),
  avatarButton: document.querySelector(".profile__avatar-button"),
  editAvatarButton: document.querySelector(".profile__edit-icon"),
};

// Включение валидации
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationSettings);

// Загружаем данные и карточки с сервера
let currentUserId;
Promise.all([getUserInfo(), getCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    renderUserInfo(userData);
    renderCards(cards, currentUserId);
  })
  .catch((err) => console.error("Ошибка при загрузке данных:", err));

// Функция для рендеринга данных пользователя
function renderUserInfo(userData) {
  elements.profileName.textContent = userData.name;
  elements.profileJob.textContent = userData.about;
  elements.profileAvatar.src = userData.avatar;
}

// Функция для рендеринга карточек
function renderCards(cards, currentUserId) {
  cards.forEach((card) => {
    const cardElement = createCard(
      card,
      currentUserId,
      openImagePopup,
      handleDelete,
      handleLike
    );
    const likeButton = cardElement.querySelector(".card__like-button");

    const isLikedByUser = card.likes.some((like) => like._id === currentUserId);
    if (isLikedByUser) {
      likeButton.classList.add("card__like-button_is-active");
    }

    elements.placesList.append(cardElement);
  });
}

// Универсальная функция для открытия попапа
function openAnyPopup(popupElement) {
  const form = popupElement.querySelector('.popup__form');
  
  if (form) {
    clearValidation(form, validationSettings); 
    enableValidation(validationSettings); 
  }

  openPopup(popupElement); 
}

// Функция для обработки загрузки кнопки
function toggleButtonLoadingState(button, isLoading, defaultText = "Сохранить") {
  if (isLoading) {
    button.textContent = "Сохранение...";
    button.disabled = true;
  } else {
    button.textContent = defaultText;
    button.disabled = false;
  }
}

// Обработчик отправки формы редактирования аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const avatarUrl = elements.avatarInput.value;
  const submitButton = evt.target.querySelector(".popup__button");

  toggleButtonLoadingState(submitButton, true);

  updateAvatar(avatarUrl)
    .then((data) => {
      elements.profileAvatar.src = data.avatar;
      closePopup(elements.avatarPopup);
    })
    .catch((err) => console.error("Ошибка при обновлении аватара:", err))
    .finally(() => {
      toggleButtonLoadingState(submitButton, false);
    });
}

// Обработка формы редактирования профиля
function handleFormEditProfile(evt) {
  evt.preventDefault();
  const name = elements.nameInput.value;
  const about = elements.jobInput.value;
  const submitButton = evt.target.querySelector(".popup__button");

  toggleButtonLoadingState(submitButton, true);

  updateUserInfo(name, about)
    .then((updatedUserData) => {
      renderUserInfo(updatedUserData);
      closePopup(elements.editPopup);
    })
    .catch((err) => console.error("Ошибка при отправке данных на сервер:", err))
    .finally(() => {
      toggleButtonLoadingState(submitButton, false);
    });
}

// Функция для добавления карточки
function handleAddCard(evt) {
  evt.preventDefault();
  const cardName = elements.placeNameInput.value;
  const cardLink = elements.placeLinkInput.value;
  const submitButton = evt.target.querySelector(".popup__button");

  toggleButtonLoadingState(submitButton, true);

  addCard(cardName, cardLink)
    .then((newCard) => {
      const cardElement = createCard(
        newCard,
        currentUserId,
        openImagePopup,
        handleDelete,
        handleLike
      );
      elements.placesList.prepend(cardElement);
      closePopup(elements.addPopup);
      elements.formAddCard.reset();
    })
    .catch((err) => console.error("Ошибка добавления карточки:", err))
    .finally(() => {
      toggleButtonLoadingState(submitButton, false);
    });
}

// Функция для постановки/снятия лайка
function handleLike(cardId, likeButton, likeCount) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  const apiRequest = isLiked ? dislikeCard : likeCard;

  apiRequest(cardId)
    .then((updatedCard) => {
      likeCount.textContent = updatedCard.likes.length;
      likeButton.classList.toggle("card__like-button_is-active", !isLiked);
    })
    .catch((err) => {
      console.error("Ошибка при изменении лайка:", err);
    });
}

// Функция для открытия попапа с изображением
function openImagePopup(imageSrc, imageAlt) {
  elements.popupImage.src = imageSrc;
  elements.popupImage.alt = imageAlt;
  elements.popupCaption.textContent = imageAlt;
  openAnyPopup(elements.imagePopup);
}

// Обработчик удаления карточки
function handleDelete(cardElement, cardId) {
  openAnyPopup(elements.deletePopup);
  elements.deleteConfirmButton.onclick = () => confirmDelete(cardElement, cardId);
}

function reloadCards() {
  elements.placesList.innerHTML = "";

  getCards()
    .then((cards) => {
      renderCards(cards, currentUserId);
    })
    .catch((err) => console.error("Ошибка при загрузке карточек:", err));
}

function confirmDelete(cardElement, cardId) {
  if (cardElement) {
    deleteCard(cardId)
      .then(() => {
        cardElement.remove();
        closePopup(elements.deletePopup);
        reloadCards();
      })
      .catch((err) => console.error("Ошибка при удалении карточки:", err));
  } else {
    console.error("Элемент не определен");
  }
}

// Функции для открытия попапов и закрытия попапов
function openEditProfilePopup() {
  resetFormValidation(elements.formEditProfile, validationSettings);
  elements.nameInput.value = elements.profileName.textContent;
  elements.jobInput.value = elements.profileJob.textContent;
  openAnyPopup(elements.editPopup);
}

function openAddCardPopup() {
  elements.formAddCard.reset();
  openAnyPopup(elements.addPopup);
}

function closePopupHandler(event) {
  if (event.target === event.currentTarget) closePopup(event.currentTarget);
}

function closeButtonHandler(button) {
  const popup = button.closest(".popup");
  closePopup(popup);
}

// Функция очистки ошибок валидации
function resetFormValidation(form, settings) {
  clearValidation(form, settings);
}

// Функция для открытия попапа редактирования аватара
function openAvatarEditPopup() {
  elements.avatarInput.value = "";
  openPopup(elements.avatarPopup); 
}

// Добавление обработчиков событий
function addEventListeners() {
  elements.editButton.addEventListener("click", openEditProfilePopup);
  elements.addButton.addEventListener("click", openAddCardPopup);
  elements.formEditProfile.addEventListener("submit", handleFormEditProfile);
  elements.formAddCard.addEventListener("submit", handleAddCard);

  elements.popups.forEach((popup) =>
    popup.addEventListener("click", closePopupHandler)
  );
  elements.closeButtons.forEach((button) =>
    button.addEventListener("click", () => closeButtonHandler(button))
  );

  // Добавляем обработчик для редактирования аватара
  elements.editAvatarButton.addEventListener("click", openAvatarEditPopup);
  elements.avatarForm.addEventListener("submit", handleAvatarFormSubmit);
}

// Инициализация приложения
function initApp() {
  addEventListeners();
}

initApp();
