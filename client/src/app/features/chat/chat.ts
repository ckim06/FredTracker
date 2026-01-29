import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { ChatService } from '@services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'fred-chat',
  standalone: true,
  imports: [
    CommonModule,
    TextareaModule,
    ButtonModule,
    AvatarModule,
    ScrollPanelModule,
    FormsModule,
  ],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FredChat {
  private readonly chatService = inject(ChatService);
  messages = this.chatService.messages;
  text = this.chatService.text;

  messagesCount = computed(() => this.messages().length);

  send() {
    this.chatService.send();

    // small timeout to allow UI to render before scrolling
    setTimeout(() => this.scrollToBottom(), 0);
  }

  private scrollToBottom() {
    const el = document.querySelector('.chat-messages');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
