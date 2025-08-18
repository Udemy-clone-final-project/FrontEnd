import { Component, Input, input } from '@angular/core';
import { Theme } from '../../Models/theme';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-by-theme',
  imports: [RouterLink , CommonModule] ,
  templateUrl: './shop-by-theme.html',
  styleUrl: './shop-by-theme.css'
})
export class ShopByTheme {
  @Input() themes:Theme[]=[]
}
