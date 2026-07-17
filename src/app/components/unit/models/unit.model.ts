export interface Unit {
  id: number;
  name: string;
  nameShort: string | null;
  inUse: boolean;
}

export interface UnitRequest {
  name: string;
  nameShort: string | null;
}
