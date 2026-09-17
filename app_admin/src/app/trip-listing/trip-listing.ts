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
	trips: WritableSignal<Trip[]> = signal([]);
	selectedTrip: WritableSignal<Trip | null> = signal(null);
	
	editForm!: FormGroup;
	submitted: boolean = false;
	message: string = '';

	protected readonly isLoggedIn = computed(() => this.authenticationService.isLoggedInSignal());

	constructor(
		private fb: FormBuilder,
		private tripData: TripData,
		private router: Router,
		private authenticationService: Authentication
	) {
		this.initForm();
	}

	private initForm(): void {
		this.editForm = this.fb.group({
			_id: [''],
			code: ['', Validators.required],
			name: ['', Validators.required],
			length: ['', Validators.required],
			start: ['', Validators.required],
			resort: ['', Validators.required],
			perPerson: ['', [Validators.required, Validators.min(1)]],
			image: ['', Validators.required],
			description: ['', Validators.required]
		});
	}

	// Helper getter for form controls in HTML
	get f() { return this.editForm.controls; }

	public addTrip(): void {
		this.router.navigate(['add-trip']);
	}

	public onTripSelect(trip: Trip): void {
		this.selectedTrip.set(trip);
		this.submitted = false;
		
		// Populate all fields from the selected trip into the side-panel form
		this.editForm.patchValue(trip);
	}

	public onSave(): void {
		this.submitted = true;

		if (this.editForm.invalid) {
			return;
		}

		// Pass the form payload directly to updateTrip API
		this.tripData.updateTrip(this.editForm.value).subscribe({
			next: (value: any) => {
				console.log('Trip updated successfully:', value);
				this.getStuff(); // Reload trip list to reflect updates
			},
			error: (error: any) => {
				console.error('Error updating trip:', error);
			}
		});
	}

	public onReset(): void {
		if (this.selectedTrip()) {
			this.editForm.patchValue(this.selectedTrip()!);
			this.submitted = false;
		}
	}

	private getStuff(): void {
		this.tripData.getTrips().subscribe({
			next: (value: any) => {
				this.trips.set(value);

				if (value.length > 0) {
					// Auto-select the first trip if none is currently selected
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

	ngOnInit(): void {
		if (this.isLoggedIn()) {
			this.getStuff();
		}
	}
}