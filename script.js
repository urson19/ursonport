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

// Убираем экран загрузки после полной загрузки страницы
window.addEventListener("load", () => {
  const pageLoader = document.querySelector(".page-loader");

  if (pageLoader) {
    setTimeout(() => pageLoader.classList.add("is-hidden"), 350);
  }
});

// Мягкий след за курсором на устройствах с обычной мышью
window.addEventListener("DOMContentLoaded", () => {
  const cursorTrail = document.querySelector(".cursor-trail");

  if (
    !cursorTrail ||
    !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const canvas = cursorTrail.querySelector(".cursor-trail__canvas");
  const context = canvas.getContext("2d");
  const points = [];
  const target = { x: -100, y: -100 };
  const current = { x: -100, y: -100 };
  let width = window.innerWidth;
  let height = window.innerHeight;

  const resizeCanvas = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const moveTrail = (event) => {
    cursorTrail.classList.add("is-active");
    target.x = event.clientX;
    target.y = event.clientY;
  };

  const animateTrail = () => {
    context.clearRect(0, 0, width, height);

    current.x += (target.x - current.x) * 0.2;
    current.y += (target.y - current.y) * 0.2;

    const lastPoint = points[points.length - 1];
    if (
      !lastPoint ||
      Math.hypot(current.x - lastPoint.x, current.y - lastPoint.y) > 1.5
    ) {
      points.push({ x: current.x, y: current.y, opacity: 1 });
    }

    points.forEach((point) => {
      point.opacity -= 0.055;
    });

    while (points.length > 20 || (points.length && points[0].opacity <= 0)) {
      points.shift();
    }

    if (points.length > 1) {
      context.lineCap = "round";
      context.lineJoin = "round";
      context.shadowBlur = 16;
      context.shadowColor = "rgba(110, 231, 183, 0.22)";

      for (let index = 1; index < points.length - 1; index += 1) {
      const previous = points[index - 1];
      const point = points[index];
      const next = points[index + 1];
      const startX = (previous.x + point.x) / 2;
      const startY = (previous.y + point.y) / 2;
      const endX = (point.x + next.x) / 2;
      const endY = (point.y + next.y) / 2;
      const opacity = point.opacity * 0.22;

      context.beginPath();
      context.lineWidth = 1.5;
      context.strokeStyle = `rgba(110, 231, 183, ${opacity})`;
      context.moveTo(startX, startY);
      context.quadraticCurveTo(point.x, point.y, endX, endY);
      context.stroke();
      }

      context.shadowBlur = 0;
    }

    window.requestAnimationFrame(animateTrail);
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", moveTrail, { passive: true });
  window.addEventListener("pointerleave", () => {
    cursorTrail.classList.remove("is-active");
    points.length = 0;
  });
  window.requestAnimationFrame(animateTrail);
});

// Плавно показываем текст по очереди и при прокрутке страницы
window.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(
    ".header__hello, .header__name, .header__role, .header__cta, " +
    ".section-title, .about__text p, .about__skills li, .project-card, " +
    ".footer__title, .footer__links, .footer__note"
  );

  revealElements.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
  });

  const reveal = (element) => element.classList.add("is-visible");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        reveal(entry.target);
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
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