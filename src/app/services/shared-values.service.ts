import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedValuesService {

  private titleSource = new BehaviorSubject<string>('UNIVERSIDAD TECNOLÓGICA DE LA COSTA');
  currentTitle = this.titleSource.asObservable();

  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public loadScript(scriptUrl: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (isPlatformBrowser(this.platformId)) {
        const scriptElement = document.createElement('script');
        scriptElement.src = scriptUrl;
        scriptElement.onload = () => {
          resolve();
        };
        scriptElement.onerror = (error) => {
          reject(error);
        };
        document.head.appendChild(scriptElement);
      } else {
        // Manejo de la carga de scripts en el servidor
        // Aquí puedes realizar una acción alternativa, como enviar una advertencia al servidor de que no se puede cargar el script
        console.warn('No se puede cargar el script en el servidor.');
        resolve();
      }
    });
  }

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
