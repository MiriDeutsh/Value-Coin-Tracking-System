import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { GraphComponent } from './graph/graph.component'; // אם הקומפוננטה בנתיב הזה


@Component({
  selector: 'app-root',
  imports: [GraphComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'coins-client';
}
