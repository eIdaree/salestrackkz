import {IUser} from "../models/IUser";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import { makeAutoObservable } from "mobx";



export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;
    API_URL = import.meta.env.VITE_BACK_URL


    constructor() {
        makeAutoObservable(this);
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

    async login(email: string, password: string,phone_number:string) {
        try {
            const response = await AuthService.login(email, password,phone_number);
            console.log(response)
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh',response.data.refresh)
            this.setAuth(true);
            console.log('login is auth:',this.isAuth)
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async registration(email: string, password: string, phone_number:string, first_name:string,last_name:string) {
        try {
            const response = await AuthService.registration(email, password, phone_number, first_name, last_name);
            console.log(response)
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            // const response = await AuthService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('refresh')
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        
        try {
            const refresh_token = localStorage.getItem('refresh')
            console.log('checkAuth refresh:',refresh_token);

            const response = await axios.post<AuthResponse>(`${this.API_URL}auth/token/refresh/`,{refresh: refresh_token}, {withCredentials: true})
            console.log('checkAuth response:',response);
            console.log('checking')
            localStorage.setItem('token', response.data.access);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}