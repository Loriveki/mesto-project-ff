const ANIMATION_DELAY = 10;
const ANIMATION_DURATION = 600;

export function closePopup(popup) {
  popup.classList.remove("popup_is-opened");

  setTimeout(() => {
    popup.classList.remove("popup_is-animated");
  }, ANIMATION_DURATION);
}

// Функция для обработки нажатия Escape
function handleEscClose(event) {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) closePopup(openedPopup);
  }
}

// Функция для открытия попапа
export function openPopup(popup) {
  document.addEventListener("keydown", handleEscClose);

  popup.classList.add("popup_is-animated");
  setTimeout(() => {
    popup.classList.add("popup_is-opened");
  }, ANIMATION_DELAY);
}
