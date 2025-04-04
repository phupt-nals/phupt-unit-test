import { Order } from '../models/Order';

export interface IOrderProcessor {
  process(order: Order, userId: number): Promise<void>;
}
