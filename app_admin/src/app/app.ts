import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Title } from './title/title';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Navbar, Title],
    templateUrl: './app.html',
    styleUrl: './app.css'
})

export class App {}
