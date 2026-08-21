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

// Section 4 使用流程 —— 影片進入畫面才播放
// 目的：影片 9MB 起跳，不該參與首屏載入，也不該在看不到的時候一直解碼。
//   1. HTML 上寫 preload="none"，瀏覽器在 play() 之前完全不會去抓影片。
//   2. IntersectionObserver 觀察整個 #process、threshold: 0，
//      也就是「區塊最上緣一碰到視窗下緣」就觸發 —— 剛好是需求說的時機。
//      這時影片本身通常還在畫面下方，等於順便預留了緩衝時間。
//      若想更省一點，把 observe 的對象換成 .pr-video 即可（要看到影片才載）。
//   3. 離開畫面就 pause()。循環由 <video loop> 負責，不必在這裡處理。
const processSection = document.querySelector("#process");
const processVideo = document.querySelector("#process-video");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (processSection && processVideo && "IntersectionObserver" in window) {
  // iOS 只認 JS 設的 muted，光靠 HTML 屬性有機會被判定成有聲而擋掉自動播放
  processVideo.muted = true;

  const processVideoObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !reduceMotion.matches) {
          // 自動播放仍可能被擋（例如 iOS 低耗電模式），
          // 這時就停在 poster，不要讓未處理的 rejection 噴到 console
          processVideo.play().catch(() => {});
        } else {
          processVideo.pause();
        }
      }
    },
    { threshold: 0 }
  );

  processVideoObserver.observe(processSection);

  // 使用者中途打開「減少動態效果」就停下來
  reduceMotion.addEventListener("change", (e) => {
    if (e.matches) processVideo.pause();
  });
}
