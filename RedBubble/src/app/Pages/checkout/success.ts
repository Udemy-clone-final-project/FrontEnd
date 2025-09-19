import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './success.html',
  styleUrls: ['./success.css']
})
export class CheckoutSuccess {
  route = inject(ActivatedRoute);
  paymentIntentId = this.route.snapshot.queryParamMap.get('pid');
}


