import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { SeriesObsResponse } from '@models';
import { ChartData } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
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
}
