import { IOrderProcessor } from '../interfaces/IOrderProcessor';
import { Order } from '../models/Order';
import { APIClient } from '../../../interfaces/APIClient';
import { APIException } from '../../../exceptions/APIException';

export class OrderProcessorB implements IOrderProcessor {
  private readonly apiClient: APIClient;

  constructor(apiClient: APIClient) {
    this.apiClient = apiClient;
  }

  async process(order: Order): Promise<void> {
    try {
      const apiResponse = await this.apiClient.callAPI(order.id);
      if (apiResponse.status !== 'success') {
        order.status = 'api_error';
        return;
      }

      if (apiResponse.data.amount >= 50 && order.amount < 100) {
        order.status = 'processed';
      } else if (apiResponse.data.amount < 50 || order.flag) {
        order.status = 'pending';
      } else {
        order.status = 'error';
      }
    } catch (error) {
      if (!(error instanceof APIException)) return;

      order.status = 'api_failure';
    }
  }
}
