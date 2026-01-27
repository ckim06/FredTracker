import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { Widget } from '@models';
import { ChartsService, WigetsService } from '@services';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'fred-table',
  imports: [TableModule],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FredTable {
  private readonly wigetsService = inject(WigetsService);
  private readonly chartsService = inject(ChartsService);
  readonly widget = input.required<Widget>();
  readonly linkedWidget = linkedSignal(() => this.widget());

  data = this.wigetsService.getWidgetData(this.linkedWidget);

  tableData = computed(() => {
    if (this.data.hasValue()) {
      return this.chartsService.parseSeriesObsToTable(this.data.value());
    }
    return [];
  });
}
