import { ChangeDetectorRef, Component, Inject } from '@angular/core';

@Component({
  selector: 'app-error-loading',
  templateUrl: './error-loading.component.html',
  styleUrl: './error-loading.component.css'
})
export class ErrorLoadingComponent {
  ruta!: string;

  constructor(
    @Inject('data') private data: any,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.ruta = this.data.message;
    this.cdr.detectChanges();
  }
}
