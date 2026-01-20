import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { Widget } from '@models';
import { DashboardService } from '../../../services/dashboard';

@Component({
  selector: 'fred-text',
  imports: [],
  templateUrl: './text.html',
  styleUrl: './text.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FredText {
  dashboardService = inject(DashboardService);
  readonly widget = input.required<Widget>();
  readonly linkedWidget = linkedSignal(() => this.widget());

  data = this.dashboardService.getWidgetData(this.linkedWidget);
}
