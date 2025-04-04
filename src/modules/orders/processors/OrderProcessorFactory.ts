import { IOrderProcessor } from '../interfaces/IOrderProcessor';
import { OrderProcessorA } from './OrderProcessorA';
import { OrderProcessorB } from './OrderProcessorB';
import { OrderProcessorC } from './OrderProcessorC';
import { APIClient } from '../../../interfaces/APIClient';

export class OrderProcessorFactory {
  static createProcessor(orderType: string, apiClient: APIClient): IOrderProcessor | null {
    switch (orderType) {
      case 'A':
        return new OrderProcessorA();
      case 'B':
        return new OrderProcessorB(apiClient);
      case 'C':
        return new OrderProcessorC();
      default:
        return null;
    }
  }
}
