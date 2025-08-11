import { Product } from "./product";

export interface SubCategory {
    id:string;
    title: string;
    image: string;

    products: Product[]
}
