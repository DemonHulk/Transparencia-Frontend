import { Component } from '@angular/core';
import { SharedValuesService } from '../../services/shared-values.service';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrl: './titulo.component.css'
})
export class TituloComponent {
  title!: string;

  constructor(private sharedService: SharedValuesService) { }

  ngOnInit(): void {
    this.sharedService.currentTitle.subscribe(title => this.title = title);
  }
}
