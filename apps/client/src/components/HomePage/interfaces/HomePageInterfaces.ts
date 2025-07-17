export interface ProductType {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: boolean;
    category: string;
    images: { url: string }[];
}

export interface Image {
    id: number;
    url: string;
    productId: number;
}

export interface CartItem {
    id: number;
    name: string;
    price: number;
    discountPrice?: number;
    images: Image[]; // Hozzáadva a képek
}

export interface ProductsProps {
    products: ProductType[];
}