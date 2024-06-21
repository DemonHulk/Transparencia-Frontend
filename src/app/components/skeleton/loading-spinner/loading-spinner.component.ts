import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  @Input() fillPercentage: number = 0;
  @Input() text: string = 'UTC';
  @Input() isVisible: boolean = false;
  @Input() updateText: string = 'Actualizando...';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fillPercentage']) {
      this.fillPercentage = Math.min(Math.max(this.fillPercentage, 0), 100);
    }
  }

  getGradient() {
    return `linear-gradient(to right, #04847C ${this.fillPercentage}%, #ccc ${this.fillPercentage}%) !important`;
  }
}
