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

@Component({
  selector: 'fred-text',
  imports: [],
  templateUrl: './text.html',
  styleUrl: './text.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FredText {
  wigetsService = inject(WigetsService);
  chartsService = inject(ChartsService);
  readonly widget = input.required<Widget>();
  readonly linkedWidget = linkedSignal(() => this.widget());

  data = this.wigetsService.getWidgetData(this.linkedWidget);

  textData = computed(() => {
    if (this.data.hasValue()) {
      return this.chartsService.parseSeriesObsToText(this.data.value());
    }
    return { value: 0, percentChange: 0 };
  });
}
