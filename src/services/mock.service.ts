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

export const mockData = {
  products: await Promise.all([
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
    {
      _id: "2",
      name: "Slim Fit Jeans",
      price: 59.99,
      description: "Classic blue slim fit jeans with stretch",
      category: "clothing",
      imageUrl: await imageService.getCategoryImage('jeans'),
      stock: 75,
      isActive: true,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      __v: 0
    },
    {
      _id: "3",
      name: "Leather Sneakers",
      price: 89.99,
      description: "White leather sneakers with minimal design",
      category: "shoes",
      imageUrl: await imageService.getCategoryImage('sneakers'),
      stock: 50,
      isActive: true,
      createdAt: "2024-01-15T11:00:00Z",
      updatedAt: "2024-01-15T11:00:00Z",
      __v: 0
    },
    {
      _id: "4",
      name: "Wool Blend Coat",
      price: 199.99,
      description: "Elegant wool blend winter coat in charcoal grey",
      category: "outerwear",
      imageUrl: await imageService.getCategoryImage('coat'),
      stock: 25,
      isActive: true,
      createdAt: "2024-01-15T11:30:00Z",
      updatedAt: "2024-01-15T11:30:00Z",
      __v: 0
    },
    {
      _id: "5",
      name: "Cotton Socks Pack",
      price: 19.99,
      description: "Pack of 5 comfortable cotton socks",
      category: "accessories",
      imageUrl: await imageService.getCategoryImage('socks'),
      stock: 200,
      isActive: true,
      createdAt: "2024-01-15T12:00:00Z",
      updatedAt: "2024-01-15T12:00:00Z",
      __v: 0
    },
    {
      id: "6",
      name: "Chelsea Boots",
      price: 199.99,
      description: "Classic leather Chelsea boots in black",
      category: "shoes",
      imageUrl: await imageService.getCategoryImage('boots'),
      stock: 35,
      createdAt: "2024-01-15T15:00:00Z"
    },
    {
      id: "7",
      name: "Cashmere Sweater",
      price: 249.99,
      description: "Soft cashmere sweater in cream color",
      category: "clothing",
      imageUrl: await imageService.getCategoryImage('sweater'),
      stock: 20,
      createdAt: "2024-01-15T16:00:00Z"
    },
    {
      id: "8",
      name: "Pleated Midi Skirt",
      price: 89.99,
      description: "Elegant pleated midi skirt in navy",
      category: "clothing",
      imageUrl: await imageService.getCategoryImage('skirt'),
      stock: 45,
      createdAt: "2024-01-15T17:00:00Z"
    },
    {
      id: "9",
      name: "Leather Belt",
      price: 49.99,
      description: "Classic leather belt with silver buckle",
      category: "accessories",
      imageUrl: await imageService.getCategoryImage('belt'),
      stock: 60,
      createdAt: "2024-01-15T18:00:00Z"
    },
    {
      id: "10",
      name: "Silk Scarf",
      price: 79.99,
      description: "Printed silk scarf with floral pattern",
      category: "accessories",
      imageUrl: await imageService.getCategoryImage('scarf'),
      stock: 55,
      createdAt: "2024-01-15T19:00:00Z"
    },
    {
      id: "11",
      name: "Leather Sneakers",
      price: 159.99,
      description: "Minimalist leather sneakers in white",
      category: "shoes",
      imageUrl: await imageService.getCategoryImage('sneakers'),
      stock: 40,
      createdAt: "2024-01-15T20:00:00Z"
    },
    {
      id: "12",
      name: "Denim Jacket",
      price: 129.99,
      description: "Classic denim jacket with vintage wash",
      category: "outerwear",
      imageUrl: await imageService.getCategoryImage('jacket'),
      stock: 30,
      createdAt: "2024-01-15T21:00:00Z"
    },
    {
      id: "13",
      name: "Leather Wallet",
      price: 45.99,
      description: "Genuine leather bifold wallet",
      category: "accessories",
      imageUrl: await imageService.getCategoryImage('wallet'),
      stock: 80,
      createdAt: "2024-01-15T22:00:00Z"
    },
    {
      id: "14",
      name: "Dress Shoes",
      price: 149.99,
      description: "Oxford dress shoes in black leather",
      category: "shoes",
      imageUrl: await imageService.getCategoryImage('dress-shoes'),
      stock: 25,
      createdAt: "2024-01-15T23:00:00Z"
    },
    {
      id: "15",
      name: "Wool Sweater",
      price: 89.99,
      description: "Cozy merino wool sweater in charcoal gray",
      category: "knitwear",
      imageUrl: await imageService.getCategoryImage('sweater'),
      stock: 35,
      createdAt: "2024-01-16T00:00:00Z"
    },
    {
      id: "16", 
      name: "Canvas Backpack",
      price: 69.99,
      description: "Durable canvas backpack with leather trim",
      category: "accessories",
      imageUrl: await imageService.getCategoryImage('backpack'),
      stock: 45,
      createdAt: "2024-01-16T01:00:00Z"
    },
    {
      id: "17",
      name: "Linen Shirt",
      price: 79.99,
      description: "Breathable linen shirt in light blue",
      category: "shirts",
      imageUrl: await imageService.getCategoryImage('shirt'),
      stock: 50,
      createdAt: "2024-01-16T02:00:00Z"
    },
    {
      id: "18",
      name: "Leather Belt",
      price: 39.99,
      description: "Classic leather belt with silver buckle",
      category: "accessories",
      imageUrl: await imageService.getCategoryImage('belt'),
      stock: 60,
      createdAt: "2024-01-16T03:00:00Z"
    },
    {
      id: "19",
      name: "Wool Coat",
      price: 249.99,
      description: "Elegant wool coat in camel color",
      category: "outerwear",
      imageUrl: await imageService.getCategoryImage('coat'),
      stock: 20,
      createdAt: "2024-01-16T04:00:00Z"
    },
    {
      id: "20",
      name: "Cotton Socks",
      price: 12.99,
      description: "Pack of 3 premium cotton socks",
      category: "accessories",
      imageUrl: await imageService.getCategoryImage('socks'),
      stock: 100,
      createdAt: "2024-01-16T05:00:00Z"
    }
  ]) as Product[],

  orders: [
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
    },
    {
      id: "ord_2", 
      userId: "usr_1",
      products: [
        {
          productId: "2",
          quantity: 1,
          price: 89.99
        },
        {
          productId: "3", 
          quantity: 2,
          price: 49.99
        }
      ],
      total: 189.97,
      status: "processing",
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles", 
        state: "CA",
        postalCode: "90001",
        country: "USA"
      },
      createdAt: "2024-01-12T18:45:00Z"
    },
    {
      id: "ord_3",
      userId: "usr_2", 
      products: [
        {
          productId: "5",
          quantity: 1,
          price: 199.99
        }
      ],
      total: 199.99,
      status: "shipped",
      shippingAddress: {
        street: "789 Pine St",
        city: "Chicago",
        state: "IL", 
        postalCode: "60601",
        country: "USA"
      },
      createdAt: "2024-01-14T12:30:00Z"
    }
  ] as Order[],

  cart: [
    {
      id: "cart_1",
      productId: "1",
      quantity: 1,
      product: {
        _id: "1",
        name: "Oversized Cotton T-Shirt",
        price: 29.99,
        description: "Premium cotton oversized t-shirt with minimalist design",
        category: "clothing",
        imageUrl: await imageService.getCategoryImage('tshirt'),
        stock: 100,
        createdAt: "2024-01-15T10:00:00Z"
      }
    },
    {
      id: "cart_2",
      productId: "2", 
      quantity: 2,
      product: {
        id: "2",
        name: "Slim Fit Jeans",
        price: 59.99,
        description: "Classic blue slim fit jeans with stretch",
        category: "clothing",
        imageUrl: await imageService.getCategoryImage('jeans'),
        stock: 75,
        createdAt: "2024-01-15T10:30:00Z"
      }
    },
    {
      id: "cart_3",
      productId: "3",
      quantity: 1,
      product: {
        id: "3",
        name: "Leather Sneakers",
        price: 89.99,
        description: "White leather sneakers with minimal design",
        category: "shoes",
        imageUrl: await imageService.getCategoryImage('sneakers'),
        stock: 50,
        createdAt: "2024-01-15T11:00:00Z"
      }
    },
    {
      id: "cart_4",
      productId: "4",
      quantity: 1,
      product: {
        id: "4",
        name: "Wool Blend Coat",
        price: 199.99,
        description: "Elegant wool blend winter coat in charcoal grey",
        category: "outerwear",
        imageUrl: await imageService.getCategoryImage('coat'),
        stock: 25,
        createdAt: "2024-01-15T11:30:00Z"
      }
    },
    {
      id: "cart_5",
      productId: "5",
      quantity: 3,
      product: {
        id: "5",
        name: "Cotton Socks Pack",
        price: 19.99,
        description: "Pack of 5 comfortable cotton socks",
        category: "accessories",
        imageUrl: await imageService.getCategoryImage('socks'),
        stock: 200,
        createdAt: "2024-01-15T12:00:00Z"
      }
    },
    {
      id: "cart_6",
      productId: "6",
      quantity: 1,
      product: {
        id: "6",
        name: "Cashmere Scarf",
        price: 89.99,
        description: "Luxurious cashmere scarf in neutral tones",
        category: "accessories",
        imageUrl: await imageService.getCategoryImage('scarf'),
        stock: 40,
        createdAt: "2024-01-15T12:30:00Z"
      }
    },
    {
      id: "cart_7",
      productId: "7",
      quantity: 2,
      product: {
        id: "7",
        name: "Linen Shirt",
        price: 69.99,
        description: "Breathable linen shirt perfect for summer",
        category: "clothing",
        imageUrl: await imageService.getCategoryImage('shirt'),
        stock: 60,
        createdAt: "2024-01-15T13:00:00Z"
      }
    },
    {
      id: "cart_8",
      productId: "8",
      quantity: 1,
      product: {
        id: "8",
        name: "Leather Belt",
        price: 49.99,
        description: "Classic brown leather belt with silver buckle",
        category: "accessories",
        imageUrl: await imageService.getCategoryImage('belt'),
        stock: 75,
        createdAt: "2024-01-15T13:30:00Z"
      }
    },
    {
      id: "cart_9",
      productId: "9",
      quantity: 1,
      product: {
        id: "9",
        name: "Silk Tie",
        price: 59.99,
        description: "Elegant silk tie with subtle pattern",
        category: "accessories",
        imageUrl: await imageService.getCategoryImage('tie'),
        stock: 45,
        createdAt: "2024-01-15T14:00:00Z"
      }
    },
    {
      id: "cart_10",
      productId: "10",
      quantity: 2,
      product: {
        id: "10",
        name: "Chino Pants",
        price: 69.99,
        description: "Classic fit chino pants in khaki",
        category: "clothing",
        imageUrl: await imageService.getCategoryImage('pants'),
        stock: 55,
        createdAt: "2024-01-15T14:30:00Z"
      }
    },
    {
      id: "cart_11",
      productId: "11",
      quantity: 1,
      product: {
        id: "11",
        name: "Denim Jacket",
        price: 89.99,
        description: "Classic denim jacket with vintage wash",
        category: "outerwear",
        imageUrl: await imageService.getCategoryImage('jacket'),
        stock: 35,
        createdAt: "2024-01-15T15:00:00Z"
      }
    },
    {
      id: "cart_12",
      productId: "12",
      quantity: 1,
      product: {
        id: "12",
        name: "Leather Wallet",
        price: 45.99,
        description: "Genuine leather bifold wallet",
        category: "accessories",
        imageUrl: await imageService.getCategoryImage('wallet'),
        stock: 80,
        createdAt: "2024-01-15T15:30:00Z"
      }
    },
    {
      id: "cart_13",
      productId: "13",
      quantity: 2,
      product: {
        id: "13",
        name: "Polo Shirt",
        price: 39.99,
        description: "Classic fit polo shirt in navy blue",
        category: "clothing",
        imageUrl: await imageService.getCategoryImage('polo'),
        stock: 90,
        createdAt: "2024-01-15T16:00:00Z"
      }
    },
    {
      id: "cart_14",
      productId: "14",
      quantity: 1,
      product: {
        id: "14",
        name: "Dress Shoes",
        price: 149.99,
        description: "Oxford dress shoes in black leather",
        category: "shoes",
        imageUrl: await imageService.getCategoryImage('dress-shoes'),
        stock: 25,
        createdAt: "2024-01-15T16:30:00Z"
      }
    },
    {
      id: "cart_15",
      productId: "15",
      quantity: 1,
      product: {
        id: "15",
        name: "Beanie Hat",
        price: 24.99,
        description: "Warm knit beanie in charcoal grey",
        category: "accessories",
        imageUrl: await imageService.getCategoryImage('beanie'),
        stock: 100,
        createdAt: "2024-01-15T17:00:00Z"
      }
    },
    {
      id: "cart_16",
      productId: "16",
      quantity: 2,
      product: {
        id: "16",
        name: "Swim Shorts",
        price: 34.99,
        description: "Quick-dry swim shorts with pattern",
        category: "clothing",
        imageUrl: await imageService.getCategoryImage('swim'),
        stock: 70,
        createdAt: "2024-01-15T17:30:00Z"
      }
    },
    {
      id: "cart_17",
      productId: "17",
      quantity: 1,
      product: {
        id: "17",
        name: "Running Shoes",
        price: 119.99,
        description: "Lightweight running shoes with cushioning",
        category: "shoes",
        imageUrl: await imageService.getCategoryImage('running-shoes'),
        stock: 40,
        createdAt: "2024-01-15T18:00:00Z"
      }
    },
    {
      id: "cart_18",
      productId: "18",
      quantity: 1,
      product: {
        id: "18",
        name: "Leather Gloves",
        price: 54.99,
        description: "Lined leather gloves for winter",
        category: "accessories",
        imageUrl: await imageService.getCategoryImage('gloves'),
        stock: 45,
        createdAt: "2024-01-15T18:30:00Z"
      }
    },
    {
      id: "cart_19",
      productId: "19",
      quantity: 2,
      product: {
        id: "19",
        name: "Hoodie",
        price: 59.99,
        description: "Cotton blend hoodie with front pocket",
        category: "clothing",
        imageUrl: await imageService.getCategoryImage('hoodie'),
        stock: 65,
        createdAt: "2024-01-15T19:00:00Z"
      }
    },
    {
      id: "cart_20",
      productId: "20",
      quantity: 1,
      product: {
        id: "20",
        name: "Sunglasses",
        price: 129.99,
        description: "Classic aviator sunglasses",
        category: "accessories",
        imageUrl: await imageService.getCategoryImage('sunglasses'),
        stock: 30,
        createdAt: "2024-01-15T19:30:00Z"
      }
    }
  ] as CartItem[],

  users: [
    {
      id: "usr_1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      isVerified: true,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "usr_2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com", 
      isVerified: true,
      createdAt: "2024-01-02T00:00:00Z"
    },
    {
      id: "usr_3",
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael@example.com",
      isVerified: false,
      createdAt: "2024-01-03T00:00:00Z"
    },
    {
      id: "usr_4", 
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah@example.com",
      isVerified: true,
      createdAt: "2024-01-04T00:00:00Z"
    },
    {
      id: "usr_5",
      firstName: "David",
      lastName: "Brown",
      email: "david@example.com",
      isVerified: true,
      createdAt: "2024-01-05T00:00:00Z"
    },
    {
      id: "usr_6",
      firstName: "Emily",
      lastName: "Jones",
      email: "emily@example.com",
      isVerified: false,
      createdAt: "2024-01-06T00:00:00Z"
    },
    {
      id: "usr_7",
      firstName: "James",
      lastName: "Wilson",
      email: "james@example.com",
      isVerified: true,
      createdAt: "2024-01-07T00:00:00Z"
    },
    {
      id: "usr_8",
      firstName: "Emma",
      lastName: "Taylor",
      email: "emma@example.com",
      isVerified: true,
      createdAt: "2024-01-08T00:00:00Z"
    },
    {
      id: "usr_9",
      firstName: "Daniel",
      lastName: "Anderson",
      email: "daniel@example.com",
      isVerified: false,
      createdAt: "2024-01-09T00:00:00Z"
    },
    {
      id: "usr_10",
      firstName: "Olivia",
      lastName: "Martinez",
      email: "olivia@example.com",
      isVerified: true,
      createdAt: "2024-01-10T00:00:00Z"
    },
    {
      id: "usr_11",
      firstName: "William",
      lastName: "Garcia",
      email: "william@example.com",
      isVerified: true,
      createdAt: "2024-01-11T00:00:00Z"
    }
  ] as User[],

  favorites: [] as FavoriteItem[]
};

export const mockService = {
  // Products
  getProducts: async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return mockData.products;
  },

  getProduct: async (_id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.products.find(p => p._id === _id);
  },

  // Orders
  getOrders: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.orders;
  },

  getOrder: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.orders.find(o => o.id === id);
  },

  createOrder: async (orderData: Partial<Order>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newOrder = {
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...orderData
    };
    mockData.orders.push(newOrder as Order);
    return newOrder;
  },

  // Cart
  getCart: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.cart;
  },

  addToCart: async (productId: string, quantity: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const product = mockData.products.find(p => p._id === productId);
    if (!product) throw new Error('Product not found');

    const cartItem = {
      id: `cart_${Date.now()}`,
      productId,
      quantity,
      product
    };
    mockData.cart.push(cartItem);
    return cartItem;
  },

  removeFromCart: async (cartItemId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockData.cart.findIndex(item => item.id === cartItemId);
    if (index > -1) {
      mockData.cart.splice(index, 1);
    }
    return true;
  },

  // User
  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.users[0]; // Return first user as current user
  },

  updateUser: async (userData: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockData.users[0];
    Object.assign(user, userData);
    return user;
  },

  getFavorites: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.favorites;
  },

  toggleFavorite: async (productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockData.favorites.findIndex(f => f.productId === productId);
    
    if (index > -1) {
      mockData.favorites.splice(index, 1);
      return false; // not favorited
    } else {
      const product = mockData.products.find(p => p._id === productId);
      if (!product) throw new Error('Product not found');
      
      mockData.favorites.push({
        id: `fav_${Date.now()}`,
        productId,
        product,
        addedAt: new Date().toISOString()
      });
      return true; // favorited
    }
  },

  updateCartItemQuantity: async (cartItemId: string, quantity: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const item = mockData.cart.find(item => item.id === cartItemId);
    if (item) {
      item.quantity = quantity;
    }
    return item;
  }
}; 