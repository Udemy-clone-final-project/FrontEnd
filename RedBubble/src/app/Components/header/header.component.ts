import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  providers: [CartService],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  cart = inject(CartService);
}
