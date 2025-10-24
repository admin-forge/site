// header.js
const headerHTML = `
<header>
  <div class="logo">MC Admin Forge</div>

  <nav id="navLinks">
    <a href="index.html">Accueil</a>
    <a href="guides.html">Guides</a>
    <a href="tools.html">Outils</a>
    <a href="assistant.html">Assistant IA</a>
    <a href="support.html">Support</a>
    <a href="contributors.html">Contributeurs</a>
    <a href="admin.html">Admin</a>
  </nav>

  <div class="burger" id="burger">
    <span></span>
    <span></span>
    <span></span>
  </div>
</header>
`;

// Injecte le header dans toutes les pages
document.body.insertAdjacentHTML('afterbegin', headerHTML);

// Burger menu toggle
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  burger.classList.toggle('toggle');
});
