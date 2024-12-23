import "./pages/index.css";
import { createCard } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";
import {
  enableValidation,
  clearValidation,
  validationSettings,
} from "./components/validation.js";
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
import { handleSubmit } from "./components/utils.js";

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
function renderCards(cards, currentUserId, method = "append") {
  cards.forEach((card) => {
    try {
      const cardElement = createCard({
        card,
        currentUserId,
        openImagePopup,
        handleDelete,
        handleLike,
      });

      elements.placesList[method](cardElement);
    } catch (error) {
      console.error("Ошибка при создании карточки:", error, card);
    }
  });
}

// Универсальная функция для открытия попапа
function openAnyPopup(popupElement, options = {}) {
  const { clearForm = false, resetForm = false, setInputValues = {}, deactivateSubmitButton = false } = options;

  // Если требуется очистка формы, делаем это
  if (clearForm) {
    const form = popupElement.querySelector(".popup__form");
    if (form) clearValidation(form, validationSettings);
  }

  // Если требуется сброс формы, делаем это
  if (resetForm) {
    const form = popupElement.querySelector(".popup__form");
    if (form) form.reset();
  }

  // Если нужно установить значения в поля ввода
  for (const [inputName, value] of Object.entries(setInputValues)) {
    const inputElement = popupElement.querySelector(`.popup__input[name="${inputName}"]`);
    if (inputElement) inputElement.value = value;
  }

  // Если нужно деактивировать кнопку сабмита
  if (deactivateSubmitButton) {
    const submitButton = popupElement.querySelector('.popup__submit');
    if (submitButton) submitButton.disabled = true;
  }

  openPopup(popupElement);
}

// Обработчик отправки формы редактирования аватара
function handleAvatarFormSubmit(evt) {
  const avatarUrl = elements.avatarInput.value;
  const makeRequest = () =>
    updateAvatar(avatarUrl).then((data) => {
      elements.profileAvatar.src = data.avatar;
      closePopup(elements.avatarPopup);
    });

  handleSubmit(makeRequest, evt);
}

// Функция для обработки отправки формы редактирования профиля
function handleFormEditProfile(evt) {
  evt.preventDefault();

  const name = elements.nameInput.value;
  const about = elements.jobInput.value;

  function makeRequest() {
    return updateUserInfo(name, about).then((updatedUserData) => {
      renderUserInfo(updatedUserData);
      closePopup(elements.editPopup);
    });
  }

  handleSubmit(makeRequest, evt);
}

// Функция для добавления карточки
function handleAddCard(evt) {
  evt.preventDefault();
  const cardName = elements.placeNameInput.value;
  const cardLink = elements.placeLinkInput.value;

  const makeRequest = () =>
    addCard(cardName, cardLink).then((newCard) => {
      const cardElement = createCard({
        card: newCard,
        currentUserId,
        openImagePopup,
        handleDelete,
        handleLike,
      });
      elements.placesList.prepend(cardElement);
      closePopup(elements.addPopup);
    });

  handleSubmit(makeRequest, evt);
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

// Обработчик удаления карточки
function handleDelete(cardElement, cardId) {
  openAnyPopup(elements.deletePopup);
  elements.deleteConfirmButton.onclick = () =>
    confirmDelete(cardElement, cardId);
}

function confirmDelete(cardElement, cardId) {
  if (cardElement) {
    deleteCard(cardId)
      .then(() => {
        cardElement.remove();
        closePopup(elements.deletePopup);
      })
      .catch((err) => console.error("Ошибка при удалении карточки:", err));
  } else {
    console.error("Элемент не определен");
  }
}

// Функция для открытия попапа с изображением
function openImagePopup(imageSrc, imageAlt) {
  elements.popupImage.src = imageSrc;
  elements.popupImage.alt = imageAlt;
  elements.popupCaption.textContent = imageAlt;
  openAnyPopup(elements.imagePopup);
}

function openEditProfilePopup() {
  openAnyPopup(elements.editPopup, {
    clearForm: true,
    setInputValues: {
      name: elements.profileName.textContent,
      description: elements.profileJob.textContent,
    },
  });
}

function openAddCardPopup() {
  openAnyPopup(elements.addPopup, { resetForm: true });
}

// Функция для открытия попапа редактирования аватара
function openAvatarEditPopup() {
  openAnyPopup(elements.avatarPopup, { resetForm: true, deactivateSubmitButton: true });
}

// Добавление обработчиков событий
function addEventListeners() {
  elements.editButton.addEventListener("click", openEditProfilePopup);
  elements.addButton.addEventListener("click", openAddCardPopup);
  elements.formEditProfile.addEventListener("submit", handleFormEditProfile);
  elements.formAddCard.addEventListener("submit", handleAddCard);

  elements.popups.forEach((popup) =>
    popup.addEventListener("click", (event) => {
      closePopup(popup, event);
    })
  );
  elements.closeButtons.forEach((button) =>
    button.addEventListener("click", () => closePopup(button.closest(".popup")))
  );

  elements.editAvatarButton.addEventListener("click", openAvatarEditPopup);
  elements.avatarForm.addEventListener("submit", handleAvatarFormSubmit);
}

enableValidation(validationSettings);

// Инициализация приложения
function initApp() {
  addEventListeners();
}

initApp();
