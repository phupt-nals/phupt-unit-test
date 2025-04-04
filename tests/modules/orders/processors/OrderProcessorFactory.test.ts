import { OrderProcessorFactory } from '@src/modules/orders/processors/OrderProcessorFactory';
import { OrderProcessorA } from '@src/modules/orders/processors/OrderProcessorA';
import { OrderProcessorB } from '@src/modules/orders/processors/OrderProcessorB';
import { OrderProcessorC } from '@src/modules/orders/processors/OrderProcessorC';
import { APIClient } from '@src/interfaces/APIClient';

jest.mock('@src/modules/orders/processors/OrderProcessorA');
jest.mock('@src/modules/orders/processors/OrderProcessorB');
jest.mock('@src/modules/orders/processors/OrderProcessorC');

describe('OrderProcessorFactory', () => {
  let mockAPIClient: APIClient;

  beforeEach(() => {
    mockAPIClient = {} as APIClient;
  });

  it('should return OrderProcessorA for order type A', () => {
    const processor = OrderProcessorFactory.createProcessor('A', mockAPIClient);

    expect(processor).toBeInstanceOf(OrderProcessorA);
  });

  it('should return OrderProcessorB for order type B', () => {
    const processor = OrderProcessorFactory.createProcessor('B', mockAPIClient);

    expect(processor).toBeInstanceOf(OrderProcessorB);
    expect(OrderProcessorB).toHaveBeenCalledWith(mockAPIClient);
  });

  it('should return OrderProcessorC for order type C', () => {
    const processor = OrderProcessorFactory.createProcessor('C', mockAPIClient);

    expect(processor).toBeInstanceOf(OrderProcessorC);
  });

  it('should return null for an unknown order type', () => {
    const processor = OrderProcessorFactory.createProcessor('D', mockAPIClient);

    expect(processor).toBeNull();
  });
});
