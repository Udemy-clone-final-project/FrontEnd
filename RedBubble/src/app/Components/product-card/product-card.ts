import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDto } from '../../Services/product.service';
import { RouterModule } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-product-card',
  imports: [CommonModule,RouterModule,CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input() product!: ProductDto;
}
