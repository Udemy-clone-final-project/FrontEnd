import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-banner',
  imports: [],
  templateUrl: './category-banner.html',
  styleUrl: './category-banner.css'
})
export class CategoryBanner {
  @Input() banner: string = '';
  @Input() title: string = '';
}
