import { Component, Input } from '@angular/core';
import { ProductCard } from '../../Models/product-card';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-best-selling-products',
  imports: [CommonModule , RouterLink],
  templateUrl: './best-selling-products.html',
  styleUrl: './best-selling-products.css'
})
export class BestSellingProducts {
@Input() bestSelling :ProductCard[] = [];
}
// title: string;
//     price?: number;
//     image: string;
//     artistName: string;