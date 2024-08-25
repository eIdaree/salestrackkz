import $api from "../http/index";
import {AxiosResponse} from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string,phone_number:string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('auth/token/', {email, password,phone_number})
    }
    static async registration(email: string, password: string, first_name: string, last_name: string, phone_number: string): Promise<void> {
        await $api.post('auth/register/', { email, password, phone_number, first_name, last_name });
    }    
    static async logout(): Promise<void> {
        return $api.post('/logout')
    }
}