const ANIMATION_DELAY = 10; 
const ANIMATION_DURATION = 600; 

let isPopupOpen = false;

export function openPopup(popup) {
  if (!isPopupOpen) {
    document.addEventListener("keydown", handleEscClose);
    isPopupOpen = true;
  }

  popup.classList.add("popup_is-animated");
  setTimeout(() => {
    popup.classList.add("popup_is-opened");
  }, ANIMATION_DELAY);
}

export function closePopup(popup) {
  popup.classList.remove("popup_is-opened");

  setTimeout(() => {
    popup.classList.remove("popup_is-animated");
  }, ANIMATION_DURATION);

  if (isPopupOpen) {
    document.removeEventListener("keydown", handleEscClose);
    isPopupOpen = false;
  }
}

function handleEscClose(event) {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) closePopup(openedPopup);
  }
}
