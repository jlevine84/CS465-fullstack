import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.html',
	styleUrl: './login.css',
})

export class Login implements OnInit {
	// Component variables
	loginForm!: FormGroup;
	public formError: string = "";
	submitted = false;

	// Component constructor
	constructor(
		private fb: FormBuilder,
		private router: Router,
		private authenticationService: Authentication
	) {}

	// On init actions
	ngOnInit(): void {
		// Form control
		this.loginForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
	}

	// Form helper function
	get f() { return this.loginForm.controls; }

	// Submit Listener
	public onLoginSubmit(): void {
		this.submitted = true;
		this.formError = "";

		if (this.loginForm.invalid) {
			this.formError = "Please correct the invalid fields below.";
			return;
		}

		this.doLogin();
	}

	// Handle the login
	private doLogin(): void {
		const formVal = this.loginForm.value;
		
		let newUser = {
			name: formVal.name,
			email: formVal.email
		} as User;
		
		this.authenticationService.login(newUser, formVal.password);

		if (this.authenticationService.isLoggedIn()) {
			this.router.navigate(['']);
		} else {
			setTimeout(() => {
				if (this.authenticationService.isLoggedIn()) {
					this.router.navigate(['']);
				} else {
					this.formError = "Authentication failed. Please check your credentials.";
				}
			}, 1000);
		}
	}
}