import { ProductCard } from "./product-card";
import { SubCategory } from "./sub-category";
import { Theme } from "./theme";

export interface Category {
    id: number | string; 
    title: string;
    banner: string;
    description?: string;

    subCategories: SubCategory[];
    themes: Theme[];
    bestSelling: ProductCard[];

}
