import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="container">
      <header class="header">
        <h1 class="header__title">Gardening Management System</h1>
      </header>
      <nav class="navbar">
        <ul class="navbar__list">
          <li class="navbar__item">
            <a class="navbar__link" routerLink="/"
              ><i class="fas fahome"></i> Home</a
            >
          </li>
          <li class="navbar__item">
            <a class="navbar__link" routerLink="/gardens"
              ><i class="fas fa-seedling"></i> Gardens</a
            >
          </li>
          <li class="navbar__item">
            <a class="navbar__link" href="/plants"
              ><i class="fas faleaf"></i> Plants</a
            >
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
    </div>
  `,
  styles: `
.container {
display: flex;
flex-direction: column;
min-height: 100vh;
width: 65%;
padding: 0;
margin: 0 auto;
}
.header, .footer {
background-color: #563d7c;
color: #fff;
padding: 10px 0;
text-align: center;
display: flex;
align-items: center;
justify-content: center;
}
.header {
min-height: 60px;
}
.header__title {
margin: 0;
}
.navbar {
text-align: center;
margin-top: 20px;
}
.navbar__list {
list-style: none;
padding: 0;
margin: 0;
display: flex;
justify-content: center;
}
.navbar__item {
margin: 0 10px;
}
.navbar__link {
text-decoration: none;
color: #6c757d;
padding: 10px 15px;
border-radius: 5px;
transition: color 0.3s;
}
.navbar__link:hover {
color: #000;
}
.main {
flex: 1;
display: flex;
flex-direction: column;
}
.main__section {
flex: 1;
}
`,
})
export class AppComponent {
  title = 'gms-client';
}
