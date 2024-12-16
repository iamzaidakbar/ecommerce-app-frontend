import { imageService } from './image.service';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Order {
  id: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

export interface FavoriteItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

class MockService {
  private products: Product[] = [];
  private orders: Order[] = [];
  private cart: CartItem[] = [];
  private favorites: FavoriteItem[] = [];
  private initialized = false;

  private async initialize() {
    if (this.initialized) return;

    // Initialize products
    this.products = [
      {
        _id: "1",
        name: "Oversized Cotton T-Shirt",
        price: 29.99,
        description: "Premium cotton oversized t-shirt with minimalist design",
        category: "clothing",
        imageUrl: await imageService.getCategoryImage('tshirt'),
        stock: 100,
        isActive: true,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
        __v: 0
      },
      // ... add other products with the same structure
    ];

    // Initialize orders
    this.orders = [
      {
        id: "ord_1",
        userId: "usr_1",
        products: [
          {
            productId: "1",
            quantity: 2,
            price: 29.99
          }
        ],
        total: 59.98,
        status: "delivered",
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "USA"
        },
        createdAt: "2024-01-10T15:30:00Z"
      }
    ];

    this.initialized = true;
  }

  async getProducts() {
    await this.initialize();
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.products;
  }

  async getProduct(_id: string) {
    await this.initialize();
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.products.find(p => p._id === _id);
  }

  async getOrders() {
    await this.initialize();
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.orders;
  }

  async getOrder(id: string) {
    await this.initialize();
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.orders.find(o => o.id === id);
  }

  async createOrder(orderData: Partial<Order>) {
    await this.initialize();
    await new Promise(resolve => setTimeout(resolve, 500));
    const newOrder = {
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...orderData
    };
    this.orders.push(newOrder as Order);
    return newOrder;
  }

  async getCart() {
    await this.initialize();
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.cart;
  }

  async addToCart(productId: string, quantity: number) {
    await this.initialize();
    await new Promise(resolve => setTimeout(resolve, 500));
    const product = this.products.find(p => p._id === productId);
    if (!product) throw new Error('Product not found');

    const cartItem = {
      id: `cart_${Date.now()}`,
      productId,
      quantity,
      product
    };
    this.cart.push(cartItem);
    return cartItem;
  }

  async removeFromCart(cartItemId: string) {
    await this.initialize();
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = this.cart.findIndex(item => item.id === cartItemId);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
    return true;
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number) {
    await this.initialize();
    await new Promise(resolve => setTimeout(resolve, 500));
    const item = this.cart.find(item => item.id === cartItemId);
    if (item) {
      item.quantity = quantity;
    }
    return item;
  }

  async getCurrentUser() {
    await this.initialize();
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: "usr_1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      isVerified: true,
      createdAt: "2024-01-10T15:30:00Z"
    };
  }

  async getFavorites() {
    await this.initialize();
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.favorites;
  }

  async toggleFavorite(productId: string) {
    await this.initialize();
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = this.favorites.findIndex(f => f.productId === productId);
    
    if (index > -1) {
      this.favorites.splice(index, 1);
      return false;
    } else {
      const product = this.products.find(p => p._id === productId);
      if (!product) throw new Error('Product not found');
      
      this.favorites.push({
        id: `fav_${Date.now()}`,
        productId,
        product,
        addedAt: new Date().toISOString()
      });
      return true;
    }
  }
}

export const mockService = new MockService(); 