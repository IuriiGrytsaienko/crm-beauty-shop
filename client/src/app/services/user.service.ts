﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { User } from '../models/index';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

  apiUrl = environment.apiUrl;

    getAll() {
        return this.http.get<User[]>(this.apiUrl + 'users');
    }

    getById(id: number) {
        return this.http.get(this.apiUrl + 'users/' + id);
    }

    create(user: User) {
        return this.http.post(this.apiUrl + 'users', user);
    }

    update(user: User) {
        return this.http.put(this.apiUrl + 'users/' + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(this.apiUrl + 'users/' + id);
    }
}