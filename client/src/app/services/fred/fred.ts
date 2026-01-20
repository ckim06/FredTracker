import { Injectable } from '@angular/core';
import { baseUrl, Widget } from '@models';

@Injectable({
  providedIn: 'root',
})
export class FredService {
  buildUrl(widget: Widget): string | undefined {
    if (!widget) return undefined;
    let queryString = '';
    if (widget.filter) {
      if (widget.filter.series) {
        queryString += `series/${encodeURIComponent(widget.filter.series)}/observations?`;
      }

      if (widget.filter.frequency) {
        queryString += `frequency=${widget.filter.frequency}`;
      }

      if (widget.filter.startDate) {
        queryString += `&observation_start=${encodeURIComponent(
          new Date(widget.filter.startDate).toISOString().split('T')[0],
        )}`;
      }

      if (widget.filter.endDate) {
        queryString += `&observation_end=${encodeURIComponent(
          new Date(widget.filter.endDate).toISOString().split('T')[0],
        )}`;
      }
    }
    return queryString ? `${baseUrl}api/${queryString}` : undefined;
  }
}
