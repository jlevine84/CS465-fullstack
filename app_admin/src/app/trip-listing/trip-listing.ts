import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { TripCard } from '../trip-card/trip-card';
import { Trip } from "../models/trip"
import { TripData } from '../services/trip-data';
import { Router } from "@angular/router"

@Component({
	selector: 'app-trip-listing',
	imports: [TripCard],
	templateUrl: './trip-listing.html',
	styleUrl: './trip-listing.css'
})

export class TripListing implements OnInit {
	trips: WritableSignal<Trip[]> = signal([])
	message: string = ""

	constructor(private tripData: TripData, private router: Router) {
		console.log("trip-listing constructor")
	}

	public addTrip(): void {
		this.router.navigate(["add-trip"])
	}

	private getStuff(): void {
		this.tripData.getTrips().subscribe({
			next: (value: any) => {
				this.trips.set(value)

				if (value.length > 0) {
					this.message = "There are " + value.length + " trips available."
				} else {
					this.message = "There were no trips retrieved from the database."
				}

				console.log(this.message);
			}, error: (error: any) => { console.log("Error: ", error) }
		})
	}

	ngOnInit(): void {
		console.log("ngOnInit")
		this.getStuff()
	}
}
