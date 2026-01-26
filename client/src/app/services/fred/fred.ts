import { Injectable } from '@angular/core';
import { baseUrl, Widget } from '@models';

@Injectable({
  providedIn: 'root',
})
export class FredService {
  buildUrl(widget: Widget): string {
    if (!widget) return '';
    let queryString = '';
    if (widget.filter) {
      if (widget.filter.series) {
        queryString += `series/${encodeURIComponent(widget.filter.series)}/observations?`;
      }

      for (const f in widget.filter) {
        const filterProp = f as keyof typeof widget.filter;
        if (f !== 'series' && widget.filter[filterProp]) {
          queryString += `${f}=${encodeURIComponent(String(widget.filter[filterProp]))}&`;
        }
      }
      queryString = queryString.slice(0, -1); // Remove trailing &
    }
    return queryString ? `${baseUrl}api/${queryString}` : '';
  }
}
