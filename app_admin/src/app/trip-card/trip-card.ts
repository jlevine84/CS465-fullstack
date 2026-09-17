import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router'
import { Trip } from "../models/trip"
import { Authentication } from '../services/authentication';

@Component({
	selector: 'app-trip-card',
	imports: [CurrencyPipe],
	templateUrl: './trip-card.html',
	styleUrl: './trip-card.css',
})

export class TripCard implements OnInit {
	@Input({ required: true }) trip!: Trip
	@Output() selectTrip = new EventEmitter<Trip>()

	onSelect(): void {
		this.selectTrip.emit(this.trip)
	}

	constructor(
		private router: Router,
		private authenticationService: Authentication
	) {}

	ngOnInit(): void { }

	public editTrip(trip: Trip) {
		localStorage.removeItem("tripCode")
		localStorage.setItem("tripCode", trip.code)
		this.router.navigate(["edit-trip"])
	}
}
