import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Authentication } from '../services/authentication';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-navbar',
	imports: [CommonModule, RouterModule],
	templateUrl: './navbar.html',
	styleUrl: './navbar.css',
})

export class Navbar implements OnInit {
	constructor(
		private authenticationService: Authentication
	) {}

	protected readonly isLoggedIn = computed(()=> this.authenticationService.isLoggedInSignal())

	ngOnInit(): void { 
		this.isLoggedIn();
	}

	public onLogout(): void {
		return this.authenticationService.logout()
	}
}
