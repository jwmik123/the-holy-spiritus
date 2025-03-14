// types/product.ts

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
  name?: string;
  date_created?: string;
  date_modified?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink?: string;
  date_created?: string;
  date_modified?: string;
  type?: string;
  status?: string;
  featured?: boolean;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable?: boolean;
  total_sales?: number;
  virtual?: boolean;
  downloadable?: boolean;
  sku: string;
  stock_quantity?: number;
  stock_status?: string;
  weight?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required?: boolean;
  shipping_taxable?: boolean;
  shipping_class?: string;
  shipping_class_id?: number;
  reviews_allowed?: boolean;
  average_rating?: string;
  rating_count?: number;
  related_ids?: number[];
  upsell_ids?: number[];
  cross_sell_ids?: number[];
  parent_id?: number;
  categories: ProductCategory[];
  tags?: any[];
  images: ProductImage[];
  attributes?: any[];
  variations?: number[];
  grouped_products?: number[];
  menu_order?: number;
  meta_data: Array<{
    id: number;
    key: string;
    value: string;
  }>;
}

export interface Collection {
  id: string | number;
  name: string;
  slug: string;
  handle?: string;
  image: string | ProductImage;
  description?: string;
  count?: number;
}
