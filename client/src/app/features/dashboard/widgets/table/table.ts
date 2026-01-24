import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { Widget } from '@models';
import { WigetsService } from '@services';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'fred-table',
  imports: [TableModule],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FredTable {
  wigetsService = inject(WigetsService);
  readonly widget = input.required<Widget>();
  readonly linkedWidget = linkedSignal(() => this.widget());

  data = this.wigetsService.getWidgetData(this.linkedWidget);

  tableData = computed(() => {
    if (this.data.hasValue()) {
      return this.wigetsService.parseSeriesObsToTable(this.data.value());
    }
    return [];
  });
}
