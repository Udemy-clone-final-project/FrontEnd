import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../Services/payment.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersPage {
  private api = inject(PaymentService);
  loading = true;
  error = '';
  orders: any[] = [];

  ngOnInit() {
    const token = localStorage.getItem('rb_token');
    if (!token) {
      this.error = 'Please log in to view your orders.';
      this.loading = false;
      return;
    }
    this.api.getOrders().subscribe({
      next: (res) => { this.orders = res || []; this.loading = false; },
      error: (e) => { this.error = 'Failed to load orders.'; this.loading = false; }
    });
  }
}


