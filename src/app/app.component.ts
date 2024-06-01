import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import flasher from "@flasher/flasher";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'transparencia-frontend';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.showErrorMessage();
    }
  }

  showErrorMessage() {
    flasher.error("Oops! Something went wrong!");
    flasher.warning("Are you sure you want to proceed?");
    flasher.success("Data has been saved successfully!");
    flasher.info("Welcome back");
  }
}
