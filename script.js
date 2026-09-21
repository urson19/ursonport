// =========================================================
// 1. ПЛАВНОЕ ПОЯВЛЕНИЕ ШАПКИ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// Один аккуратный эффект при загрузке — без анимаций на каждой секции
// =========================================================
window.addEventListener("DOMContentLoaded", () => {
  const headerInner = document.querySelector(".header__inner");

  // Ставим начальное состояние через JS, чтобы без JS страница
  // всё равно была видна (постепенное улучшение — progressive enhancement)
  headerInner.style.opacity = "0";
  headerInner.style.transform = "translateY(12px)";
  headerInner.style.transition = "opacity 0.6s ease, transform 0.6s ease";

  // Небольшая задержка, чтобы браузер успел применить стартовые стили
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      headerInner.style.opacity = "1";
      headerInner.style.transform = "translateY(0)";
    });
  });
});

// =========================================================
// 2. ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА (RU / EN)
// Все элементы с атрибутами data-ru и data-en автоматически
// переводятся при клике на кнопку в меню
// =========================================================
const langToggle = document.getElementById("lang-toggle");
let currentLang = "ru"; // язык по умолчанию

langToggle.addEventListener("click", () => {
  // Переключаем язык на противоположный
  currentLang = currentLang === "ru" ? "en" : "ru";

  // Находим ВСЕ элементы, у которых есть перевод, и подставляем нужный текст
  document.querySelectorAll("[data-ru][data-en]").forEach((el) => {
    el.textContent = el.dataset[currentLang];
  });

  // Меняем текст самой кнопки на противоположный язык
  langToggle.textContent = currentLang === "ru" ? "EN" : "RU";

  // Обновляем атрибут lang у страницы — это полезно для скринридеров и поисковиков
  document.documentElement.lang = currentLang;
});

// =========================================================
// 3. КОПИРОВАНИЕ ПОЧТЫ В БУФЕР ОБМЕНА
// Клик по ссылке "Почта" копирует адрес и показывает подсказку,
// а затем всё равно открывает почтовый клиент как обычно
// =========================================================
const emailLink = document.getElementById("email-link");

emailLink.addEventListener("click", (event) => {
  const email = emailLink.textContent.trim() === "Почта"
    ? emailLink.href.replace("mailto:", "")
    : emailLink.href.replace("mailto:", "");

  // Пробуем скопировать адрес в буфер обмена
  if (navigator.clipboard) {
    navigator.clipboard.writeText(email).then(() => {
      showTooltip(emailLink, "Скопировано!");
    });
  }
  // Ссылка продолжает работать как обычная mailto-ссылка,
  // поэтому event.preventDefault() здесь не нужен
});

// Небольшая всплывающая подсказка рядом с элементом
function showTooltip(target, text) {
  const tooltip = document.createElement("span");
  tooltip.textContent = text;
  tooltip.style.position = "absolute";
  tooltip.style.marginTop = "-32px";
  tooltip.style.marginLeft = "8px";
  tooltip.style.padding = "4px 10px";
  tooltip.style.fontSize = "0.8rem";
  tooltip.style.borderRadius = "6px";
  tooltip.style.background = "#6ee7b7";
  tooltip.style.color = "#0f1712";
  tooltip.style.fontWeight = "600";
  tooltip.style.pointerEvents = "none";

  target.style.position = "relative";
  target.appendChild(tooltip);

  // Убираем подсказку через 1.5 секунды
  setTimeout(() => tooltip.remove(), 1500);
}