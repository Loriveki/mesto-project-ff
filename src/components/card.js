export function createCard(
  card,
  currentUserId,
  openImagePopup,
  handleDelete,
  handleLike
) {
  const cardTemplate = document
    .querySelector("#card-template")
    .content.cloneNode(true);
  const cardElement = cardTemplate.querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  // Устанавливаем данные карточки
  cardImage.src = card.link || "#";
  cardImage.alt = card.name || "Изображение";
  cardTitle.textContent = card.name || "Без названия";
  likeCount.textContent = Array.isArray(card.likes) ? card.likes.length : 0;

  // Проверка: лайкнута ли карточка текущим пользователем
  const isLikedByUser = card.likes?.some((like) => like._id === currentUserId);
  if (isLikedByUser) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Управление кнопкой удаления
  deleteButton.classList.toggle("card__delete-button_hidden", card.owner._id !== currentUserId);

  if (card.owner && card.owner._id === currentUserId) {
    deleteButton.addEventListener("click", (event) => {
      const cardElement = event.target.closest(".card");
      handleDelete(cardElement, card._id);
    });
  }

  // Обработчик клика по картинке для открытия попапа
  cardImage.addEventListener("click", () => openImagePopup(card.link, card.name));

  // Обработчик лайка
  likeButton.addEventListener("click", () => {
    handleLike(card._id, likeButton, likeCount);
  });

  return cardElement;
}
