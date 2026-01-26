import { Injectable } from '@angular/core';
import { baseUrl, SeriesObsResponse, Widget, WidgetFormData } from '@models';
import { httpResource } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { ChartData } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  readonly widgets = httpResource<Widget[]>(() => `${baseUrl}db`, {
    defaultValue: [],
  });

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
  getChartOptions() {
    return {
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }
  public parseSeriesObs(rawResponse: SeriesObsResponse): ChartData {
    return {
      labels: rawResponse.observations.map((obs) => formatDate(obs.date, 'M/yy', 'en-US')),

      datasets: [
        {
          label: '',
          pointStyle: false,
          borderColor: '#10b981',
          data: rawResponse.observations.map((obs) => parseFloat(obs.value)),
          tension: 0.1,
        },
      ],
    };
  }
  parseSeriesObsToText(rawResponse: SeriesObsResponse): { value: number; percentChange: number } {
    const observations = rawResponse.observations;
    if (observations.length < 2) {
      return { value: 0, percentChange: 0 };
    }
    const lastValue = parseFloat(observations[observations.length - 1].value);
    const secondLastValue = parseFloat(observations[observations.length - 2].value);
    const percentChange =
      secondLastValue !== 0 ? ((lastValue - secondLastValue) / secondLastValue) * 100 : 0;
    return { value: lastValue, percentChange };
  }

  public parseSeriesObsToTable(rawResponse: SeriesObsResponse): { date: string; value: string }[] {
    return rawResponse.observations.map((obs) => ({
      date: formatDate(obs.date, 'MM/dd/yyyy', 'en-US'),
      value: obs.value,
    }));
  }
}
