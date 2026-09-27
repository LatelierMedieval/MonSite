(() => {
  const template = document.createElement('template');
  template.innerHTML = '<footer class="footer">\n        <span>© 2024-2026 L\'Atelier Médiéval. Tous droits réservés.</span>\n        <span>Maquettes · Figurines · Tutoriels</span>\n      </footer>';
  const element = template.content.firstElementChild;
  document.currentScript.replaceWith(element);
})();
