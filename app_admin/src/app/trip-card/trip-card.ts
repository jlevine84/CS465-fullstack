import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Trip } from "../models/trip";

@Component({
	selector: 'app-trip-card',
	standalone: true,
	imports: [CurrencyPipe],
	templateUrl: './trip-card.html',
	styleUrl: './trip-card.css',
})

export class TripCard implements OnInit {
	// Component inputs & outputs
	@Input({ required: true }) trip!: Trip;
	@Output() selectTrip = new EventEmitter<Trip>();

	// Card selection trigger
	onSelect(): void {
		this.selectTrip.emit(this.trip);
	}

	// Component constructor
	constructor() {}

	// On init actions
	ngOnInit(): void { }
}