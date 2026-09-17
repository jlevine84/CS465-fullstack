import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Authentication } from '../services/authentication';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './navbar.html',
	styleUrl: './navbar.css',
})

export class Navbar {
	// Service injections
	private router = inject(Router);
	private authenticationService = inject(Authentication);

	// Auth check
	protected readonly isLoggedIn = computed(() => this.authenticationService.isLoggedInSignal());

	// Reactive Signal tracking current active URL path
	private currentUrl = toSignal(
		this.router.events.pipe(
			filter(e => e instanceof NavigationEnd),
			map((e: NavigationEnd) => e.urlAfterRedirects)
		),
		{ initialValue: this.router.url }
	);

	// Returns true if on inventory list OR adding/editing a trip
	protected isTripRoute = computed(() => {
		const url = this.currentUrl();
		return url === '/' || url === '/add-trip' || url.startsWith('/trips');
	});

	// Handle logout action
	public onLogout(): void {
		this.authenticationService.logout();
	}
}