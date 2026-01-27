import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { initalWidget, Widget } from '@models';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { form, Field, required, submit } from '@angular/forms/signals';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { ChartsService } from '@services';
@Component({
  selector: 'fred-widget-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    Field,
    DatePickerModule,
    MessageModule,
  ],
  templateUrl: './widget-form.html',
  styleUrl: './widget-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetForm {
  chartsService = inject(ChartsService);
  widget = input<Widget>(initalWidget);
  widgetSubmit = output<Widget>();

  linkedWidget = linkedSignal(() => this.chartsService.widgetToFormData(this.widget()));
  widgetForm = form(this.linkedWidget, (schemaPath) => {
    required(schemaPath.title, { message: 'Title is required' });
  });

  frequencies = [
    { type: 'm', name: 'Monthly' },
    { type: 'q', name: 'Quarterly' },
    { type: 'sa', name: 'Semi-Annual' },
    { type: 'a', name: 'Annual' },
  ];
  widgetTypes = [
    { type: 'text', name: 'Text' },
    { type: 'graph', name: 'Graph' },
    { type: 'table', name: 'Table' },
  ];

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.widgetForm, async () => {
      this.widgetSubmit.emit(this.chartsService.formDataToWidget(this.linkedWidget()));
    });
  }
}
