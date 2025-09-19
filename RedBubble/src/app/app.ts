import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { ChatbotComponent } from './Components/chatbot/chatbot.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ChatbotComponent ],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  protected readonly title = signal('RedBubble');
}
