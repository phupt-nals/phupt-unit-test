import { IOrderProcessor } from '../interfaces/IOrderProcessor';
import { Order } from '../models/Order';

export class OrderProcessorC implements IOrderProcessor {
  async process(order: Order): Promise<void> {
    order.status = order.flag ? 'completed' : 'in_progress';
  }
}
