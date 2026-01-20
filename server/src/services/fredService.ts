import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

export async function fetchCategorySeries(categoryId = 27286) {
  return fredGet("/category/series", {
    category_id: categoryId,
  });
}

export async function fetchSeriesMetadata(seriesId: string) {
  return fredGet("/series", {
    series_id: seriesId
  });
}

export async function fetchSeriesObservations(seriesId: string, params: { frequency?: string; units?: string; start?: string; end?: string } = {}) {
  return fredGet("/series/observations", {
    series_id: seriesId,
    frequency: params.frequency ?? "m",
    units: params.units ?? "lin",
    observation_start: params.start ?? "2000-01-01",
    observation_end: params.end ?? "9999-12-31"
  });
}

export async function searchSeries(text: string) {
  return fredGet("/series/search", {
    search_text: text
  });
}

async function fredGet(path: string, params = {}) {
  try {
    const response = await axios.get(`${FRED_BASE_URL}${path}`, {
      params: {
        api_key: FRED_API_KEY,
        file_type: "json",
        ...params
      }
    });

    return response.data;
  } catch (err: any) {
    console.error("FRED API Error:", err.response?.data || err.message);
    throw new Error("Failed to fetch data from FRED API.");
  }
}
