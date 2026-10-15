export type Role = 'admin' | 'resident';

export interface User {
  id: number;
  username: string;
  name: string;
  role: Role;
}

export interface Notice {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface NoticePage {
  items: Notice[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface Area {
  id: string;
  name: string;
}

export interface Slot {
  id: string;
  label: string;
}

export interface Reservation {
  id: number;
  area: string;
  areaName: string;
  date: string;
  slot: string;
  slotLabel: string;
  status: 'Confirmed' | 'Canceled';
  residentName?: string;
}
