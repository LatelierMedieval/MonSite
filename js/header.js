(() => {
  const template = document.createElement('template');
  template.innerHTML = '<header class="topbar">\n        <button class="menu-btn" id="menuBtn" aria-label="Ouvrir le menu">☰</button>\n        <div class="topbar-spacer"></div>\n        <button class="icon-btn" id="themeBtn" aria-label="Changer de thème">◐</button>\n      </header>';
  const element = template.content.firstElementChild;
  document.currentScript.replaceWith(element);
})();
