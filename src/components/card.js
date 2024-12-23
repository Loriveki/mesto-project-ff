export function createCard({
  card = {},
  currentUserId,
  openImagePopup,
  handleDelete,
  handleLike,
}) {
  const cardTemplate = document
    .querySelector("#card-template")
    .content.cloneNode(true);

  const cardElement = cardTemplate.querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;
  likeCount.textContent = card.likes.length;

  const isLikedByUser = card.likes?.some((like) => like._id === currentUserId);
  if (isLikedByUser) {
    likeButton.classList.add("card__like-button_is-active");
  }

  deleteButton.classList.toggle(
    "card__delete-button_hidden",
    card.owner._id !== currentUserId
  );

  if (card.owner._id === currentUserId) {
    deleteButton.addEventListener("click", (event) => {
      const cardElement = event.target.closest(".card");
      handleDelete(cardElement, card._id);
    });
  }

  cardImage.addEventListener("click", () =>
    openImagePopup(card.link, card.name)
  );

  likeButton.addEventListener("click", () => {
    handleLike(card._id, likeButton, likeCount);
  });

  return cardElement;
}
