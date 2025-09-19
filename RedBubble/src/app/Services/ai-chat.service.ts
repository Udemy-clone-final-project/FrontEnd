import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private http = inject(HttpClient);
  private apiBase = 'https://localhost:7106/api';

  send(message: string) {
    return this.http.post<{ reply: string }>(`${this.apiBase}/chat`, { message });
  }
}


