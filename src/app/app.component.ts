import { ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { IStaticMethods } from 'preline';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private router: Router) {

  }
  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 1000);
      }
    });
  }
}
