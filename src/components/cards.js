export function createCard(cardData, handleLike = null, handleImageClick = null) {
  const cardElement = createCardElement();
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  if (handleLike) {
    likeButton.addEventListener('click', () => handleLike(likeButton));
  }

  if (handleImageClick) {
    cardImage.addEventListener('click', () => handleImageClick(cardImage.src, cardTitle.textContent));
  }

  deleteButton.addEventListener('click', () => {
    cardElement.remove(); 
  });

  return cardElement;
}

function createCardElement() {
  const cardTemplate = document.querySelector('#card-template').content;
  return cardTemplate.cloneNode(true).querySelector('.card');
}

export function handleLike(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}
