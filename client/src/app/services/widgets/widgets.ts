import { DestroyRef, inject, Injectable, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { baseUrl, SeriesObsResponse, Widget } from '@models';
import { HttpClient, httpResource } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { FredService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class WigetsService {
  private readonly http = inject(HttpClient);
  private readonly fredService = inject(FredService);
  private destroyRef = inject(DestroyRef);
  readonly widgets = httpResource<Widget[]>(() => `${baseUrl}db`, {
    defaultValue: [],
  });

  submitWidget(widget: Widget): Observable<Widget> {
    if (widget.id) {
      return this.updateWidget(widget);
    }
    return this.addWidget(widget);
  }
  deleteWidget(id: string): Observable<void> {
    return this.http.delete<void>(`${baseUrl}db/${id}`).pipe(
      tap(() => {
        this.widgets.update((widgets) => widgets?.filter((w) => w.id !== id));
      }),
      catchError((error) => {
        console.error(error);
        return of(error);
      }),
    );
  }
  private updateWidget(widget: Widget): Observable<Widget> {
    return this.http.put<Widget>(`${baseUrl}db/`, widget).pipe(
      takeUntilDestroyed(this.destroyRef),
      map((widgetFromServer) => {
        this.widgets.update((widgets) => {
          return widgets?.map((w) => (w.id === widgetFromServer.id ? widgetFromServer : w));
        });
        return widgetFromServer;
      }),
      catchError((error) => {
        console.error(error);
        return of(error);
      }),
    );
  }
  private addWidget(widget: Widget): Observable<Widget> {
    return this.http.post<Widget>(`${baseUrl}db/`, widget).pipe(
      map((widgetFromServer) => {
        this.widgets.update((widgets) => [...(widgets ?? []), widgetFromServer]);
        return widgetFromServer;
      }),
      catchError((error) => {
        console.error(error);
        return of(error);
      }),
    );
  }
  public getWidgetData(widget: Signal<Widget>) {
    return httpResource<SeriesObsResponse>(() => this.fredService.buildUrl(widget()));
  }
}
