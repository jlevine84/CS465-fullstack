import { Routes } from '@angular/router';
import { AddTrip } from "./add-trip/add-trip"
import { TripListing } from "./trip-listing/trip-listing"
import { EditTrip } from './edit-trip/edit-trip';
import { Login } from './login/login';
import { LogsListing } from './logs-listing/logs-listing';
import { UserListing } from './user-listing/user-listing';

export const routes: Routes = [
    { path: "add-trip", component: AddTrip },
    { path: "", component: TripListing, pathMatch: "full" },
    { path: "**", redirectTo: " " },
    { path: "edit-trip", component: EditTrip },
    { path: "login", component: Login },
    { path: "logs", component: LogsListing },
    { path: "users", component: UserListing }
];
