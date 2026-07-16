export interface Country {
  id: number;
  name: string;
  nameShort: string | null;
  adjective: string | null;
}

export interface CountryRequest {
  name: string;
  nameShort: string;
  adjective: string;
}
