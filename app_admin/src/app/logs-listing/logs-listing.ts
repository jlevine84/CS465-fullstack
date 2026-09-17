import { Component, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';

@Component({
	selector: 'app-logs-listing',
	imports: [],
	templateUrl: './logs-listing.html',
	styleUrl: './logs-listing.css',
})

export class LogsListing implements OnInit {
	// isLoggedLogin boolean value 
	protected readonly isLoggedIn = computed(()=> this.authenticationService.isLoggedInSignal())

	constructor(
		private authenticationService: Authentication
	) {}

	ngOnInit(): void {
		
	}
}
