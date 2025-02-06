export interface ICCProfileHeader {
  size: number;
  cmmType: string;
  version: string;
  deviceClass: string;
  colorSpace: string;
  pcs: string;
  date: Date;
  signature: string;
  platform: string;
  flags: number;
  manufacturer: string;
  model: string;
  attributes: number;
  renderingIntent: number;
  illuminant: [number, number, number];
  creator: string;
}