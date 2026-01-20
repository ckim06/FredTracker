import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { Widget } from '@models';
import { FredService } from '../../../../../services/fred/fred';
import { ChartsService } from '../../../services/charts';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../../../services/dashboard';
@Component({
  selector: 'fred-graph',
  imports: [ChartModule],
  templateUrl: './graph.html',
  styleUrl: './graph.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FredGraph {
  charts = inject(ChartsService);
  dashboardService = inject(DashboardService);
  fredService = inject(FredService);
  readonly widget = input.required<Widget>();
  readonly linkedWidget = linkedSignal(() => this.widget());

  data = this.dashboardService.getWidgetData(this.linkedWidget);

  chartData = computed(() => {
    if (this.data.hasValue()) {
      return this.charts.parseSeriesObs(this.data.value());
    }
    return null;
  });
  chartOptions = this.charts.getChartOptions();
}
