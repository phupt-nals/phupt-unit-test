// File: DatabaseService.ts
import { Order } from '../modules/orders/models/Order';

export interface DatabaseService {
  getOrdersByUser(userId: number): Promise<Order[]>;
  updateOrderStatus(orderId: number, status: string, priority: string): Promise<boolean>;
}
