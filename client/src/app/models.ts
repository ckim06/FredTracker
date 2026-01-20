export interface BaseWidget {
  id?: string;
  type: 'graph' | 'table' | 'text';
  title: string;
}
export interface Widget extends BaseWidget {
  filter: Filter;
}

export interface WidgetFormData extends BaseWidget {
  filter: FilterForm;
}

export interface BaseFilter {
  series: string;
  frequency: 'm' | 'q' | 'sa' | 'a';
}

export interface Filter extends BaseFilter {
  startDate: Date | string;
  endDate: Date | string;
}

export interface FilterForm extends BaseFilter {
  dateRange: [Date | string, Date | string];
}
export interface Filter {
  series: string;
  frequency: 'm' | 'q' | 'sa' | 'a';
  startDate: Date | string;
  endDate: Date | string;
}

export interface SeriesObsResponse {
  realtime_start: Date;
  realtime_end: Date;
  observation_start: Date;
  observation_end: Date;
  units: string;
  output_type: number;
  order_by: 'observation_date';
  sort_order: 'asc' | 'desc';
  count: number;
  offset: number;
  limit: number;
  observations: Observation[];
}

export interface Observation {
  date: string;
  value: string;
  realtime_start: Date;
  realtime_end: Date;
}
export const baseUrl = 'http://localhost:4200/';

export const initalFilter: Filter = {
  series: '',
  frequency: 'a',
  startDate: new Date(0),
  endDate: new Date(),
};
export const initalWidget: Widget = { title: '', type: 'graph', filter: initalFilter };
