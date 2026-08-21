// Header 漢堡選單
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");

function closeNav() {
  navLinks.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "開啟選單");
}

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "關閉選單" : "開啟選單");
});

// 點選單內連結後自動收合
navLinks.addEventListener("click", (e) => {
  if (e.target.closest("a")) closeNav();
});

// 點選單以外的地方收合
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-and-button")) closeNav();
});

// 按 Esc 收合
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNav();
});

// 視窗放大回桌機尺寸時，把展開狀態清掉，避免縮回手機時選單還開著
window.matchMedia("(min-width: 1200px)").addEventListener("change", (e) => {
  if (e.matches) closeNav();
});
