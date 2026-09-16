import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Authentication } from '../services/authentication';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-title',
	imports: [CommonModule, RouterModule],
	templateUrl: './title.html',
	styleUrl: './title.css',
})

export class Title implements OnInit {
	
	constructor(
		private authenticationService: Authentication
	) {}

	// Vars
    protected readonly title = signal('Travlr Getaways Administrative Dashboard');
	protected readonly isLoggedIn = computed(()=> this.authenticationService.isLoggedInSignal())

	ngOnInit(): void { }

	public onLogout(): void {
		return this.authenticationService.logout()
	}
}