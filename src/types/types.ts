export interface IWorker {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  salary: number;
  is_whatsapp_verify?: boolean;
  is_telegram_verify?: boolean;
  telegram_id?: string;
  schedule: ISchedule[];
}

export interface ISchedule {
  id: number;
  week_day: number;
  time_from: string;
  time_to: string;
}

export interface IUser {
  email: string;
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  avatar: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: IUser;
}
