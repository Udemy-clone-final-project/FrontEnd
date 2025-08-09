import { Component, Input, input } from '@angular/core';
import { SubCategory } from '../../Models/sub-category';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sub-category-grid',
  imports: [RouterLink , CommonModule],
  templateUrl: './sub-category-grid.html',
  styleUrl: './sub-category-grid.css'
})
export class SubCategoryGrid {
  @Input() subCategories: SubCategory[] = [];
}
