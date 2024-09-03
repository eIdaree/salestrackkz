import { IUser, AuthResponse } from "../types/types";
import AuthService from "../services/AuthService";
import axios from 'axios';
import { makeAutoObservable } from "mobx";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;
    API_URL = import.meta.env.VITE_BACK_URL;

    constructor() {
        makeAutoObservable(this);
        this.checkAuth(); 
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string, phone_number: string) {
        try {
            const response = await AuthService.login(email, password, phone_number);
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            this.setAuth(true);
            this.setUser(response.data.user);
            return true;
        } catch (e: any) {
            console.log(e.response?.data?.message);
            return false;
        }
    }

    async registration(email: string, password: string, phone_number: string, first_name: string, last_name: string) {
        try {
            await AuthService.registration(email, password, phone_number, first_name, last_name);
            return { success: true};
        } catch (e: any) {
            return {success:false, message: e.response?.data?.message};
        }
    }

    async logout() {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);

        try {
            const refresh_token = localStorage.getItem('refresh');
            if (!refresh_token) {
                this.setAuth(false);
                return;
            }

            const response = await axios.post<AuthResponse>(
                `${this.API_URL}auth/token/refresh/`,
                { refresh: refresh_token },
                { withCredentials: true  }
            );
            const profile_response = await axios.get(
                `${this.API_URL}profile`,
                {
                  headers: {
                    Authorization: `Bearer ${response.data.access}`,
                  },
                }
              );
            localStorage.setItem('token', response.data.access);
            this.setAuth(true);
            this.setUser(profile_response.data);
        } catch (e: any) {
            console.log(e);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh');
            this.setAuth(false);
        } finally {
            this.setLoading(false);
        }
    }
}
