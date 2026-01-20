import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DashboardService } from '../services/dashboard';
import { CommonModule } from '@angular/common';
import { FredGraph } from './widgets/graph/graph';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FredTable } from './widgets/table/table';
import { FredText } from './widgets/text/text';
import { BaseWidget, WidgetTitle, WidgetBody } from './widgets/widget/widget';

import { DialogModule } from 'primeng/dialog';
import { initalWidget, Widget } from '@models';
import { WidgetForm } from '../widget-form/widget-form';
import { ButtonModule } from 'primeng/button';
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
  private readonly dashboardService = inject(DashboardService);
  readonly widgets = this.dashboardService.widgets;

  readonly text = computed(() => this.widgets.value().filter((w) => w.type === 'text'));
  readonly graphs = computed(() => this.widgets.value().filter((w) => w.type === 'graph'));
  readonly tables = computed(() => this.widgets.value().filter((w) => w.type === 'table'));

  editingWidget = signal<Widget>(initalWidget);
  showWidgetForm = false;
  menuItems = [
    {
      label: 'Add Widget',
      icon: 'pi pi-fw pi-plus',
      command: () => {
        this.editingWidget.set(initalWidget);
        this.showWidgetForm = true;
      },
    },
  ];

  onWidgetSubmit(widget: Widget) {
    this.dashboardService.submitWidget(widget);
  }

  onWidgetEdit(widget: Widget) {
    this.editingWidget.set(widget);
    this.showWidgetForm = true;
  }

  onWidgetDelete(widget: Widget) {
    if (widget.id) {
      this.dashboardService.deleteWidget(widget.id);
    }
  }
}
