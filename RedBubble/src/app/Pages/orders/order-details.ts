import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaymentService } from '../../Services/payment.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.css']
})
export class OrderDetailsPage {
  private api = inject(PaymentService);
  private route = inject(ActivatedRoute);

  loading = true;
  error = '';
  order: any = null;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    this.api.getOrders().subscribe({
      next: (orders) => {
        this.order = Array.isArray(orders) ? orders.find((o: any) => (o.id ?? o.orderId) == id) : null;
        if (!this.order) this.error = 'Order not found.';
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load order.'; this.loading = false; }
    });
  }
}


