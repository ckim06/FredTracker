import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { Widget } from '@models';
import { ChartModule } from 'primeng/chart';
import { WigetsService } from '@services';
import { ChartsService } from '../../services';
@Component({
  selector: 'fred-graph',
  imports: [ChartModule],
  templateUrl: './graph.html',
  styleUrl: './graph.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FredGraph {
  charts = inject(ChartsService);
  wigetsService = inject(WigetsService);
  readonly widget = input.required<Widget>();
  readonly linkedWidget = linkedSignal(() => this.widget());

  data = this.wigetsService.getWidgetData(this.linkedWidget);

  chartData = computed(() => {
    if (this.data.hasValue()) {
      return this.charts.parseSeriesObs(this.data.value());
    }
    return null;
  });
  chartOptions = this.charts.getChartOptions();
}
