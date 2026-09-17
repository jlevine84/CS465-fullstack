import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';

@Component({
    selector: 'app-add-trip',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './add-trip.html',
    styleUrl: './add-trip.css'
})
export class AddTrip implements OnInit {
    addForm!: FormGroup;
    submitted = false;

    protected readonly isLoggedIn = computed(() => this.authenticationService.isLoggedInSignal());

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private tripService: TripData,
        private authenticationService: Authentication
    ) {}

    ngOnInit(): void {
        this.addForm = this.formBuilder.group({
            _id: [],
            code: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}[0-9]{3,6}$/)]],
            name: ['', [Validators.required, Validators.minLength(3)]],
            length: ['', Validators.required],
            start: ['', Validators.required],
            resort: ['', Validators.required],
            perPerson: ['', [Validators.required, Validators.min(1)]],
            image: ['', Validators.required],
            description: ['', [Validators.required, Validators.minLength(10)]],
        });
    }

    public onSubmit(): void {
        this.submitted = true;
        
        if (this.addForm.valid) {
            this.tripService.addTrip(this.addForm.value).subscribe({
                next: (data: any) => {
                    console.log('Trip created:', data);
                    this.router.navigate(['']);
                },
                error: (error: any) => {
                    console.error('Error adding trip: ', error);
                }
            });
        }
    }

    get f() { return this.addForm.controls; }

    public cancelBtn(): void {
        this.router.navigate(["/"]);
    }
}