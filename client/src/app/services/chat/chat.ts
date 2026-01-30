import { Injectable, signal } from '@angular/core';
import { ChatMessage } from '@models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _messages = signal<ChatMessage[]>([
    { id: 'm0', from: 'bot', text: 'Hi — how can I help?' },
  ]);
  messages = this._messages.asReadonly();
  text = signal('');

  append(from: 'user' | 'bot', text: string) {
    const id = `m${Date.now()}`;
    this._messages.set([...this.messages(), { id, from, text }]);

    if (from === 'user') {
      this.text.set('');
    }
  }

  async send() {
    const text = this.text().trim();
    if (!text) return;
    this.append('user', text);

    try {
      const res = await fetch('/mcp/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) {
        const err = await res.text();
        this.append('bot', err);
        return;
      }
      const json = await res.json();
      const reply =
        typeof json.response === 'string' ? json.response : JSON.stringify(json.response);
      this.append('bot', reply);
    } catch (err: unknown) {
      this.append('bot', err as string);
    }
  }
}
