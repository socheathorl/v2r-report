export interface Product {
  id?:string;
  code?:string;
  name?:string;
  description?:string;
  price?:number;
  quantity?:number;
  inventoryStatus?:string;
  category?:string;
  image?:string;
  rating?:number;
  orders?: any[];
  loading?: boolean;
}

export interface S3File {
  Key?: string;
  FileName?: string;
  LastModified?: Date;
  Size?: number;
}