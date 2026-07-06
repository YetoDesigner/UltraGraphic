export interface Product {
  name: string;
  desc: string;
  icon: string;
  grad: string;
  price: string | null;
  likes: number;
  kw: string[];
}

export type ViewType = 'vitrina' | 'feed';

export interface Message {
  role: 'user' | 'bot';
  content: string;
}
