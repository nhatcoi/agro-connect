import { db } from '../database/simple-db';

export interface Order {
  id: number;
  order_number: string;
  farmer_id: number;
  business_id: number;
  product_id: number;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_amount: number;
  currency: string;
  status: 'pending' | 'negotiating' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  delivery_address: string;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_date?: string;
  notes?: string;
  contract_url?: string;
  qr_code?: string;
  blockchain_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  farmer_id: number;
  business_id: number;
  product_id: number;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_amount: number;
  currency: string;
  delivery_address: string;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_date?: string;
  notes?: string;
  contract_url?: string;
  qr_code?: string;
  blockchain_hash?: string;
  status?: 'pending' | 'negotiating' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
}

export interface UpdateOrderData {
  quantity?: number;
  unit?: string;
  price_per_unit?: number;
  total_amount?: number;
  currency?: string;
  status?: 'pending' | 'negotiating' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  delivery_address?: string;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_date?: string;
  notes?: string;
  contract_url?: string;
  qr_code?: string;
  blockchain_hash?: string;
}

export class OrderModel {
  static async create(orderData: CreateOrderData): Promise<Order> {
    const orderNumber = db.generateOrderNumber();
    return await db.createOrder({
      ...orderData,
      order_number: orderNumber,
      status: orderData.status || 'pending'
    });
  }

  static async findById(id: number): Promise<Order | null> {
    return await db.findOrderById(id);
  }

  static async findByFarmerId(farmerId: number): Promise<Order[]> {
    return await db.findOrdersByFarmerId(farmerId);
  }

  static async findByBusinessId(businessId: number): Promise<Order[]> {
    return await db.findOrdersByBusinessId(businessId);
  }

  static async findByUserId(userId: number): Promise<Order[]> {
    return await db.findOrdersByUserId(userId);
  }

  static async update(id: number, orderData: UpdateOrderData): Promise<Order | null> {
    return await db.updateOrder(id, orderData);
  }

  static async delete(id: number): Promise<boolean> {
    return await db.deleteOrder(id);
  }

  static async getAll(limit: number = 50, offset: number = 0): Promise<Order[]> {
    return await db.getAllOrders(limit, offset);
  }

  static async findByStatus(status: string): Promise<Order[]> {
    return await db.findOrdersByStatus(status);
  }

  static async getOrderStats(userId: number): Promise<{
    total: number;
    pending: number;
    negotiating: number;
    confirmed: number;
    in_progress: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    completed: number;
  }> {
    const orders = await db.findOrdersByUserId(userId);
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      negotiating: orders.filter(o => o.status === 'negotiating').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      in_progress: orders.filter(o => o.status === 'in_progress').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      completed: orders.filter(o => o.status === 'completed').length
    };
  }
}
