import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-recursive-nav-item',
  templateUrl: './recursive-nav-item.component.html',
  styleUrl: './recursive-nav-item.component.css'
})
export class RecursiveNavItemComponent {
  @Input() item: any;
  @Input() activeItemId: string | number | null = null;
  @Output() itemSelected = new EventEmitter<any>();

  onItemClick() {
    this.itemSelected.emit(this.item.id_titulo);
  }

  isActive(): boolean {
    return this.activeItemId === this.item.id_titulo;
  }
}
