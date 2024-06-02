import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedValuesService {

  private titleSource = new BehaviorSubject<string>('UNIVERSIDAD TECNOLÓGICA DE LA COSTA');
  currentTitle = this.titleSource.asObservable();

  constructor() { }

  changeTitle(title: string) {
    this.titleSource.next(title);
  }
}
