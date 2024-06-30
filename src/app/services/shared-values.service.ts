import { ApplicationRef, ComponentRef, ElementRef, Inject, Injectable, Injector, PLATFORM_ID, Renderer2, RendererFactory2, SecurityContext, Type, createComponent } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ErrorLoadingComponent } from '../partials/error-loading/error-loading.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SharedValuesService {

  private titleSource = new BehaviorSubject<string>('UNIVERSIDAD TECNOLÓGICA DE LA COSTA');
  currentTitle = this.titleSource.asObservable();

  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private appRef: ApplicationRef,
    private injector: Injector,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  getComponentHtml<T>(component: Type<T>, data: any): SafeHtml {
    const childInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector
    });

    const componentRef: ComponentRef<T> = createComponent(component, {
      environmentInjector: this.appRef.injector,
      elementInjector: childInjector
    });

    // Ejecutar detección de cambios
    componentRef.changeDetectorRef.detectChanges();

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    const htmlContent = domElem.outerHTML;

    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();

    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  updateErrorLoading(el: ElementRef, data: any): void {
    const safeHtmlContent = this.getComponentHtml(ErrorLoadingComponent, data);
    el.nativeElement.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, safeHtmlContent) || '';
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

  private dataSubject = new BehaviorSubject<any>(null); // Puedes especificar el tipo de datos en lugar de `any`
  public data$ = this.dataSubject.asObservable();

  sendData(data: any): void {
    this.dataSubject.next(data);
  }
}
