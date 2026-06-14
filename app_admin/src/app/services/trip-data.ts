import { Service } from '@angular/core';
import { Trip } from "../models/trip"
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
    providedIn: "root"
})

export class TripData {

    constructor(
        private http: HttpClient,
        @Inject(BROWSER_STORAGE) private storage: Storage
    ) {}

    baseUrl = "http://localhost:3000/api"

    /* Trip endpoints */
    // All trips
    getTrips() : Observable<Trip[]> {
        return this.http.get<Trip[]> (this.baseUrl + "/trips")
    }

    // Add a new trip
    addTrip(formData: Trip): Observable<Trip> {
        return this.http.post<Trip> (this.baseUrl + "/trips", formData)
    }

    // Get a single trip
    getTrip(tripCode: string): Observable<Trip[]> {
        return this.http.get<Trip[]> (this.baseUrl + "/trips/" + tripCode)
    }

    // Update a trip
    updateTrip(formData: Trip): Observable<Trip> {
        return this.http.put<Trip> (this.baseUrl + "/trips/" + formData.code, formData)
    }

    // Helper method to process the login and register methods
    handleAuthAPICall(endpoint: string, user: User, password: string): Observable<AuthResponse> {
        let formData = {
            name: user.name,
            email: user.email,
            password: password
        }

        return this.http.post<AuthResponse>(this.baseUrl + "/" + endpoint, formData)
    }

    // Call to login endpoint: Get JWT- 
    login(user: User, password: string): Observable<AuthResponse> {
        return this.handleAuthAPICall("login", user, password)
    }

    // Call to register endpoint: Create a user and get JWT
    register(user: User, password: string): Observable<AuthResponse> {
        return this.handleAuthAPICall("register", user, password)
    }
}
