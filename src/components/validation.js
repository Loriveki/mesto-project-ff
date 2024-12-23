export const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Универсальная функция для поиска элемента ошибки
function getErrorElement(form, input) {
  return form.querySelector(`#${input.name}-error`);
}

// Универсальная функция для показа ошибок
function showInputError(form, input, errorMessage, settings) {
  const errorElement = getErrorElement(form, input);
  if (!errorElement) {
    console.error(`Элемент ошибки для input с name="${input.name}" не найден.`);
    return;
  }
  input.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
}

// Универсальная функция для скрытия ошибок
export function hideInputError(form, input, settings) {
  const errorElement = getErrorElement(form, input);
  if (!errorElement) return;
  input.classList.remove(settings.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(settings.errorClass);
}

// Функция изменения состояния кнопки сабмита
export function toggleButtonState(inputs, button, settings) {
  const isFormValid = inputs.every((input) => input.validity.valid);
  button.disabled = !isFormValid;
  button.classList.toggle(settings.inactiveButtonClass, !isFormValid);
}

// Функция установки обработчиков событий
function setEventListeners(form, settings) {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const button = form.querySelector(settings.submitButtonSelector);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (!input.validity.valid) {
        showInputError(form, input, input.validationMessage, settings);
      } else {
        hideInputError(form, input, settings);
      }
      toggleButtonState(inputs, button, settings);
    });
  });
}

export function enableValidation(settings) {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));
  forms.forEach((form) => {
    form.addEventListener("submit", (evt) => evt.preventDefault());
    setEventListeners(form, settings);
  });
}

// Функция очистки ошибок
export function clearValidation(form, settings) {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const button = form.querySelector(settings.submitButtonSelector);

  inputs.forEach((input) => hideInputError(form, input, settings));
  toggleButtonState(inputs, button, settings);
}
