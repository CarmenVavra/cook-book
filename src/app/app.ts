import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly window = isPlatformBrowser(inject(PLATFORM_ID)) ? window : undefined;
  protected auth: AuthService | null = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(AuthService) : null;

  logout(): void {
    if (!this.auth) return;
    const returnTo = this.window?.location.origin ?? 'http://localhost:4200';
    this.auth.logout({ logoutParams: { returnTo } });
  }
}
