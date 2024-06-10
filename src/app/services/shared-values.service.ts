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

  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  login(): void {
    // Lógica de inicio de sesión
    this.loggedIn.next(true);
  }

  logout(): void {
    // Lógica de cierre de sesión
    this.loggedIn.next(false);
  }

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }

}
