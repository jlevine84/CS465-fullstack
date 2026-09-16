import { WritableSignal, signal, Injectable, Inject } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data';

@Injectable({
	providedIn: 'root' 
})

// Define Auth service
export class Authentication {
    // Reactive Signal tracking login state across components
    public isLoggedInSignal: WritableSignal<boolean> = signal<boolean>(false);

    // Storage and service access setup
    constructor(
        @Inject(BROWSER_STORAGE) private storage: Storage,
        private tripData: TripData
    ) {
        // Init signal state on service instantiation
        this.isLoggedInSignal.set(this.checkTokenValidity())
    }

    // Check if current token exists and is not expired
    private checkTokenValidity(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.exp > (Date.now() / 1000);
        } catch (e) {
            return false;
        }
    }

    // Variable to handle Auth responses
    authRes: AuthResponse = new AuthResponse()

    // Method for retrieval of token from Storage
    public getToken(): string {
        let out: any
        out = this.storage.getItem("travlr-token")

        // If no token, return an empty string
        if (!out) { return "" }

        // If token, return it
        return out
    }

    // Method to save token from Storage 
    public saveToken(token: string): void {
        this.storage.setItem("travlr-token", token)
        this.isLoggedInSignal.set(true);
    }

    // Method to logout of application and remove token from storage
    public logout(): void {
        this.storage.removeItem("travlr-token")
        this.isLoggedInSignal.set(false);
    }

    /* Accessors and Mutators */
    // Method for verifying if a user is logged in and token is still valid
    public isLoggedIn(): boolean {
        return this.isLoggedInSignal();
    }

    // Retrieve current user
    public getCurrentUser(): User {
        const token: string = this.getToken()
        const { email, name } = JSON.parse(atob(token.split(".")[1]))

        return { email, name } as User
    }

    // Login method 
    public login(user: User, password: string): void {
        this.tripData.login(user, password).subscribe({
            next: (value: any)=> {
                // If the user was logged in, set vals
                if (value) {
                    console.log(value)
                    this.authRes = value
                    this.saveToken(this.authRes.token)
                }
            }, 
            error: (error: any)=> {
                // Catch error if one occurs
                console.log("Error: " + error)
            }
        })
    }

    // Register method
    public register(user: User, password: string): void {
        this.tripData.register(user, password).subscribe({
            next: (value: any)=> {
                // If the user was logged in, set vals
                if (value) {
                    console.log(value)
                    this.authRes = value
                    this.saveToken(this.authRes.token)
                }
            }, 
            error: (error: any)=> {
                // Catch error if one occurs
                console.log("Error: " + error)
            }
        })
    }
}
