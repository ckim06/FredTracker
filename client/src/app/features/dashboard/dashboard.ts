import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FredTable } from './widgets/table/table';
import { FredText } from './widgets/text/text';
import { BaseWidget, WidgetTitle, WidgetBody } from './widgets/widget/widget';
import { DialogModule } from 'primeng/dialog';
import { WidgetForm } from '../widget-form/widget-form';
import { ButtonModule } from 'primeng/button';
import { Widget } from '@models';
import { WigetsService, LayoutService } from '@services';

import { FredGraph } from './widgets/graph/graph';
@Component({
  selector: 'fred-dashboard',
  imports: [
    CommonModule,
    FredGraph,
    FredTable,
    FredText,
    BaseWidget,
    ProgressSpinnerModule,
    WidgetTitle,
    WidgetBody,
    DialogModule,
    ButtonModule,
    WidgetForm,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly wigetsService = inject(WigetsService);
  private readonly layoutService = inject(LayoutService);
  readonly widgets = this.wigetsService.widgets;

  readonly text = computed(() => this.widgets.value().filter((w) => w.type === 'text'));
  readonly graphs = computed(() => this.widgets.value().filter((w) => w.type === 'graph'));
  readonly tables = computed(() => this.widgets.value().filter((w) => w.type === 'table'));

  editingWidget = this.layoutService.editingWidget;
  showWidgetForm = this.layoutService.showWidgetForm;
  modalHeader = this.layoutService.modalHeader;

  onWidgetSubmit(widget: Widget) {
    this.layoutService.closeModal();
    this.wigetsService.submitWidget(widget);
  }

  onWidgetEdit(widget: Widget) {
    this.layoutService.openEditModal(widget);
  }

  onWidgetDelete(widget: Widget) {
    if (widget.id) {
      this.wigetsService.deleteWidget(widget.id);
    }
  }

  openAddWidgetModal() {
    this.layoutService.openAddModal();
  }
}
