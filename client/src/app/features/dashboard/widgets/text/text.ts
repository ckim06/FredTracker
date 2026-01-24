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

@Component({
  selector: 'fred-text',
  imports: [],
  templateUrl: './text.html',
  styleUrl: './text.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FredText {
  wigetsService = inject(WigetsService);
  readonly widget = input.required<Widget>();
  readonly linkedWidget = linkedSignal(() => this.widget());

  data = this.wigetsService.getWidgetData(this.linkedWidget);

  textData = computed(() => {
    if (this.data.hasValue()) {
      return this.wigetsService.parseSeriesObsToText(this.data.value());
    }
    return { value: 0, percentChange: 0 };
  });
}
