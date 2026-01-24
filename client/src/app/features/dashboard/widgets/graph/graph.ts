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
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'fred-graph',
  imports: [ChartModule, SkeletonModule],
  templateUrl: './graph.html',
  styleUrl: './graph.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FredGraph {
  wigetsService = inject(WigetsService);
  readonly widget = input.required<Widget>();
  readonly linkedWidget = linkedSignal(() => this.widget());

  data = this.wigetsService.getWidgetData(this.linkedWidget);

  chartData = computed(() => {
    if (this.data.hasValue()) {
      return this.wigetsService.parseSeriesObs(this.data.value());
    }
    return null;
  });
  chartOptions = this.wigetsService.getChartOptions();
}
