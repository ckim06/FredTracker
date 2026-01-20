import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { Widget } from '@models';
import { DashboardService } from '../../../services/dashboard';

@Component({
  selector: 'fred-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FredTable {
  dashboardService = inject(DashboardService);
  readonly widget = input.required<Widget>();
  readonly linkedWidget = linkedSignal(() => this.widget());

  data = this.dashboardService.getWidgetData(this.linkedWidget);
}
