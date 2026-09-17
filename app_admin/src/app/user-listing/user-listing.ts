import { Component, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';

@Component({
	selector: 'app-user-listing',
	imports: [],
	templateUrl: './user-listing.html',
	styleUrl: './user-listing.css',
})
export class UserListing {
	// isLoggedLogin boolean value 
	protected readonly isLoggedIn = computed(()=> this.authenticationService.isLoggedInSignal())

	constructor(
		private authenticationService: Authentication
	) {}

	ngOnInit(): void {
		
	}
}
