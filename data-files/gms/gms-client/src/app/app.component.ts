<div class="container">
  <header class="header">
    <h1 class="header__title">Gardening Management System</h1>
  </header>
  <nav class="navbar">
    <ul class="navbar__list">
      <li class="navbar__item">
        <a class="navbar__link" routerLink="/">
          <i class="fas fahome"></i> Home
        </a>
      </li>
      <li class="navbar__item">
        <a class="navbar__link" routerLink="/gardens">
          <i class="fas fa-seedling"></i> Gardens
        </a>
      </li>
      <li class="navbar__item">
        <a class="navbar__link" routerLink="/plants">
          <i class="fas fa-leaf"></i> Plants
        </a>
      </li>
    </ul>
  </nav>
  <main class="main">
    <section class="main__section">
      <router-outlet></router-outlet>
    </section>
  </main>
  <footer class="footer">
    <p class="footer__text">&copy; 2024 MEAN Stack Project</p>
  </footer>
</div>;
