import { Component } from '@angular/core';

@Component({
  selector: 'app-articulo33',
  templateUrl: './articulo33.component.html',
  styleUrl: './articulo33.component.css'
})
export class Articulo33Component {
  getNumbers(): number[] {
    const numbers: number[] = [];
    for (let i = 1; i <= 48; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  isButtonListHidden = true;

  toggleButtonList() {
    this.isButtonListHidden = !this.isButtonListHidden;
  }


}
