import { Component, inject } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  cart = inject(CartService);
}
