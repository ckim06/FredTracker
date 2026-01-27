import { Injectable, signal } from '@angular/core';
import { initalWidget, Widget } from '@models';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  static readonly ADD_WIDGET_HEADER = 'Add New Widget';
  static readonly EDIT_WIDGET_HEADER = 'Edit Widget';
  private readonly _editingWidget = signal<Widget>(initalWidget);
  readonly editingWidget = this._editingWidget.asReadonly();

  showWidgetForm = signal(false);

  private readonly _modalHeader = signal(LayoutService.ADD_WIDGET_HEADER);
  readonly modalHeader = this._modalHeader.asReadonly();

  setEditingWidget(widget: Widget) {
    this._editingWidget.set(widget);
  }
  openAddModal() {
    this._modalHeader.set(LayoutService.ADD_WIDGET_HEADER);
    this.setEditingWidget(initalWidget);
    this.showWidgetForm.set(true);
  }

  openEditModal(widget: Widget) {
    this._modalHeader.set(LayoutService.EDIT_WIDGET_HEADER);
    this.setEditingWidget(widget);
    this.showWidgetForm.set(true);
  }

  closeModal() {
    this.showWidgetForm.set(false);
  }
}
