export interface ChristmasTree {
  id: string;
  size: number;
  colorCode: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export type TreeSize = {
  value: number;
  label: string;
  colorCode: string;
  description: string;
}
