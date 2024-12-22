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

// Функция проверки валидности инпута
function checkInputValidity(form, input, settings) {
  const errorMessage = getCustomErrorMessage(input);
  if (!input.validity.valid) {
    showInputError(form, input, errorMessage, settings);
  } else {
    hideInputError(form, input, settings);
  }
}

// Функция получения пользовательского сообщения об ошибке
function getCustomErrorMessage(input) {
  const namePattern = /^[A-Za-z\u0400-\u04FFёЁ\s-]+$/;
  const urlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

  if (input.validity.valueMissing) {
    return "Вы пропустили это поле";
  }

  if (["name", "card-name"].includes(input.name)) {
    if (input.validity.tooShort) {
      return `Минимальное количество символов: ${
        input.minLength
      }. Длина текста сейчас: ${input.value.length} символ${
        input.value.length === 1 ? "" : "а"
      }`;
    }
    if (input.validity.tooLong) {
      return `Максимальное количество символов: ${
        input.maxLength
      }. Длина текста сейчас: ${input.value.length} символ${
        input.value.length === 1 ? "" : "а"
      }`;
    }
    if (!namePattern.test(input.value)) {
      return "Можно использовать только буквы, пробелы и дефисы";
    }
  }

  if (["link", "url", "avatar", "image-url"].includes(input.name)) {
    if (!urlPattern.test(input.value)) {
      return "Введите адрес сайта.";
    }
  }

  return input.validationMessage;
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
      checkInputValidity(form, input, settings);
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
