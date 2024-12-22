const ANIMATION_DELAY = 10; 
const ANIMATION_DURATION = 600; 

export function openPopup(popup) {
  if (!document.querySelector(".popup_is-opened")) {
    document.addEventListener("keydown", handleEscClose);
  }

  if (!popup.classList.contains("popup_is-animated")) {
    popup.classList.add("popup_is-animated");
  }

  setTimeout(() => {
    popup.classList.add("popup_is-opened");
    const focusable = popup.querySelector("input, button, textarea");
    if (focusable) focusable.focus();
  }, ANIMATION_DELAY);
}

export function closePopup(popup) {
  popup.classList.remove("popup_is-opened");

  setTimeout(() => {
    popup.classList.remove("popup_is-animated");
  }, ANIMATION_DURATION);

  if (!document.querySelector(".popup_is-opened")) {
    document.removeEventListener("keydown", handleEscClose);
  }
}

function handleEscClose(event) {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) closePopup(openedPopup);
  }
}
