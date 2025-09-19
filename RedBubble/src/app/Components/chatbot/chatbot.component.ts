import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService } from '../../Services/ai-chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  constructor(private chat: AiChatService) {}

  messages = signal<{ role: 'user' | 'assistant'; content: string }[]>([]);
  input = '';
  open = false;
  loading = false;

  toggle() {
    this.open = !this.open;
  }

  async send() {
    const text = this.input.trim();
    if (!text || this.loading) return;
    this.messages.update(m => [...m, { role: 'user', content: text }]);
    this.input = '';
    this.loading = true;
    try {
      const res = await this.chat.send(text).toPromise();
      const reply = res?.reply ?? '';
      this.messages.update(m => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      this.messages.update(m => [...m, { role: 'assistant', content: 'حدث خطأ، حاول لاحقاً.' }]);
    } finally {
      this.loading = false;
    }
  }
}


