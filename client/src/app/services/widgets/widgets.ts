import { inject, Injectable, Signal } from '@angular/core';
import { baseUrl, SeriesObsResponse, Widget, WidgetFormData } from '@models';
import { HttpClient, httpResource } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FredService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class WigetsService {
  private readonly http = inject(HttpClient);
  private readonly fredService = inject(FredService);
  readonly widgets = httpResource<Widget[]>(() => `${baseUrl}db`, {
    defaultValue: [],
  });
  updateWidget(widget: Widget) {
    return this.http
      .put<Widget>(`${baseUrl}db/`, widget)
      .pipe(
        catchError((error) => {
          console.error(error);
          return of(error);
        }),
      )
      .subscribe(() => {
        this.widgets.update((widgets) => {
          widgets.find((w) => w.id === widget.id);
          return widgets?.map((w) => (w.id === widget.id ? widget : w));
        });
      });
  }
  submitWidget(widget: Widget) {
    if (widget.id) {
      return this.updateWidget(widget);
    }
    return this.addWidget(widget);
  }

  deleteWidget(id: string) {
    return this.http
      .delete<void>(`${baseUrl}db/${id}`)
      .pipe(
        catchError((error) => {
          console.error(error);
          return of(error);
        }),
      )
      .subscribe(() => {
        this.widgets.update((widgets) => widgets?.filter((w) => w.id !== id));
      });
  }
  addWidget(widget: Widget) {
    return this.http
      .post<Widget>(`${baseUrl}db/`, widget)
      .pipe(
        catchError((error) => {
          console.error(error);
          return of(error);
        }),
      )
      .subscribe(() => {
        this.widgets.update((widgets) => [...(widgets ?? []), widget]);
      });
  }
  public getWidgetData(widget: Signal<Widget>) {
    return httpResource<SeriesObsResponse>(() => this.fredService.buildUrl(widget()));
  }

  public formDataToWidget(formData: WidgetFormData): Widget {
    return {
      id: formData.id,
      title: formData.title,
      type: formData.type,
      filter: {
        series: formData.filter.series,
        frequency: formData.filter.frequency,
        startDate: formData.filter?.dateRange[0] ?? new Date(0),
        endDate: formData.filter?.dateRange[1] ?? new Date(),
      },
    };
  }

  public widgetToFormData(widget: Widget): WidgetFormData {
    return {
      id: widget.id ?? '',
      title: widget.title ?? '',
      type: widget.type || 'graph',
      filter: {
        series: widget.filter.series ?? '',
        frequency: widget.filter?.frequency || 'm',
        dateRange: [
          (new Date(widget.filter?.startDate) as Date) ?? new Date(0),
          (new Date(widget.filter?.endDate) as Date) ?? new Date(),
        ],
      },
    };
  }
}
