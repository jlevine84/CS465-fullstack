import { Component, OnInit, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-trip-card',
  imports: [CurrencyPipe],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})

export class TripCard implements OnInit{
  @Input("trip") trip: any
  
  constructor() {}

  ngOnInit(): void {
      
  }
}
