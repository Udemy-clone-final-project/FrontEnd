import { Component, inject } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { RouterModule } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, AsyncPipe, NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  cart = inject(CartService);
  auth = inject(AuthService);
}
