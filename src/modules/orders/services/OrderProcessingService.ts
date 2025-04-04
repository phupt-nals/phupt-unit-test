import { DatabaseService } from '../../../interfaces/DatabaseService';
import { APIClient } from '../../../interfaces/APIClient';
import { Order } from '../models/Order';
import { DatabaseException } from '../../../exceptions/DatabaseException';
import { OrderProcessorFactory } from '../processors/OrderProcessorFactory';

export class OrderProcessingService {
  private readonly dbService: DatabaseService;
  private readonly apiClient: APIClient;

  constructor(dbService: DatabaseService, apiClient: APIClient) {
    this.dbService = dbService;
    this.apiClient = apiClient;
  }

  async processOrders(userId: number): Promise<Order[] | false> {
    try {
      const orders = await this.dbService.getOrdersByUser(userId);

      for (const order of orders) {
        const processor = OrderProcessorFactory.createProcessor(order.type, this.apiClient);
        if (processor) {
          await processor.process(order, userId);
        } else {
          order.status = 'unknown_type';
        }

        order.priority = order.amount > 200 ? 'high' : 'low';

        try {
          await this.dbService.updateOrderStatus(order.id, order.status, order.priority);
        } catch (error) {
          if (error instanceof DatabaseException) {
            order.status = 'db_error';
          }
        }
      }

      return orders;
    } catch (error) {
      return false;
    }
  }
}
