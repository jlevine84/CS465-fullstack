import { Component, OnInit, signal, WritableSignal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripCard } from '../trip-card/trip-card';
import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';

@Component({
	selector: 'app-trip-listing',
	standalone: true,
	imports: [TripCard, ReactiveFormsModule],
	templateUrl: './trip-listing.html',
	styleUrl: './trip-listing.css'
})

export class TripListing implements OnInit {
	// Signals and state variables
	trips: WritableSignal<Trip[]> = signal([]);
	selectedTrip: WritableSignal<Trip | null> = signal(null);
	
	// Form controls & flags
	editForm!: FormGroup;
	submitted: boolean = false;
	message: string = '';

	// Auth check
	protected readonly isLoggedIn = computed(() => this.authenticationService.isLoggedInSignal());

	// Component constructor
	constructor(
		private fb: FormBuilder,
		private tripData: TripData,
		private router: Router,
		private authenticationService: Authentication
	) {
		this.initForm();
	}

	// Form control setup
	private initForm(): void {
		this.editForm = this.fb.group({
			_id: [''],
			code: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}[0-9]{3,6}$/)]],
			name: ['', [Validators.required, Validators.minLength(3)]],
			length: ['', Validators.required],
			start: ['', Validators.required],
			resort: ['', Validators.required],
			perPerson: ['', [Validators.required, Validators.min(1)]],
			image: ['', Validators.required],
			description: ['', [Validators.required, Validators.minLength(10)]]
		});
	}

	// Helper getter for form controls
	get f() { return this.editForm.controls; }

	// Route to add trip page
	public addTrip(): void {
		this.router.navigate(['add-trip']);
	}

	// Selection handler from trip-card click
	public onTripSelect(trip: Trip): void {
		this.selectedTrip.set(trip);
		this.submitted = false;
		
		// Populate selected record into form
		this.editForm.patchValue(trip);
	}

	// Submit listener for side panel edit
	public onSave(): void {
		this.submitted = true;

		if (this.editForm.invalid) {
			return;
		}

		// Save modifications to backend API
		this.tripData.updateTrip(this.editForm.value).subscribe({
			next: (value: any) => {
				console.log('Trip updated successfully:', value);
				this.getStuff(); // Refresh list view
			},
			error: (error: any) => {
				console.error('Error updating trip:', error);
			}
		});
	}

	// Form reset action
	public onReset(): void {
		if (this.selectedTrip()) {
			this.editForm.patchValue(this.selectedTrip()!);
			this.submitted = false;
		}
	}

	// Data getter
	private getStuff(): void {
		this.tripData.getTrips().subscribe({
			next: (value: any) => {
				this.trips.set(value);

				if (value.length > 0) {
					// Auto-select first item if none is currently targeted
					if (!this.selectedTrip()) {
						this.onTripSelect(value[0]);
					}
					this.message = 'There are ' + value.length + ' trips available.';
				} else {
					this.message = 'There were no trips retrieved from the database.';
				}
				console.log(this.message);
			},
			error: (error: any) => {
				console.error('Error: ', error);
			}
		});
	}

	// On init actions
	ngOnInit(): void {
		if (this.isLoggedIn()) {
			this.getStuff();
		}
	}
}