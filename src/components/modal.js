const ANIMATION_DELAY = 10;
const ANIMATION_DURATION = 600;

export function closePopup(popup, event = null) {
  if (event) {
    // Если передано событие, проверяем, был ли клик по фону
    if (event.target === event.currentTarget) {
      popup.classList.remove("popup_is-opened");
      setTimeout(() => {
        popup.classList.remove("popup_is-animated");
      }, ANIMATION_DURATION);
    }
  } else {
    // Если событие не передано, закрываем попап напрямую
    popup.classList.remove("popup_is-opened");
    setTimeout(() => {
      popup.classList.remove("popup_is-animated");
    }, ANIMATION_DURATION);
  }

  // Удаляем обработчик нажатия Escape
  document.removeEventListener("keydown", handleEscClose);
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
