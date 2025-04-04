import { OrderProcessorB } from '@src/modules/orders/processors/OrderProcessorB';
import { APIClient } from '@src/interfaces/APIClient';
import { Order } from '@src/modules/orders/models/Order';
import { APIException } from '@src/exceptions/APIException';
import { APIResponse } from '@src/utils/APIResponse';

const mockAPIClient: jest.Mocked<APIClient> = {
  callAPI: jest.fn(),
};

describe('OrderProcessorB', () => {
  let order: Order;
  let processor: OrderProcessorB;

  beforeEach(() => {
    order = new Order(1, 'B', 100, false);
    processor = new OrderProcessorB(mockAPIClient);
  });

  it('should set status to api_failure if API call fails with APIException', async () => {
    mockAPIClient.callAPI.mockRejectedValue(new APIException('API failure'));
    await processor.process(order);
    expect(order.status).toBe('api_failure');
  });

  it('should not change the status if API call fails with an unknown exception', async () => {
    mockAPIClient.callAPI.mockRejectedValue(new Error('Unknown error'));
    await processor.process(order);
    expect(order.status).toBe('new');
  });

  it('should set status to api_error if API call does not return success', async () => {
    mockAPIClient.callAPI.mockResolvedValue(new APIResponse('error', order));
    await processor.process(order);
    expect(order.status).toBe('api_error');
  });

  it('should set status to error if the client api response amount is (greater than or equal 50) and the order amount is (greater than or equal 100) and the order flag is falsy', async () => {
    mockAPIClient.callAPI.mockResolvedValue(new APIResponse('success', order));
    await processor.process(order);
    expect(order.status).toBe('error');
  });

  it('should set status to processed if the client api response amount greater than or equal 50 and the order amount less than 100', async () => {
    order.amount = 69;

    mockAPIClient.callAPI.mockResolvedValue(new APIResponse('success', order));
    await processor.process(order);
    expect(order.status).toBe('processed');
  });

  it('should set status to pending if the client api response amount is less than 50', async () => {
    order.amount = 49;

    mockAPIClient.callAPI.mockResolvedValue(new APIResponse('success', order));
    await processor.process(order);
    expect(order.status).toBe('pending');
  });

  it('should set status to pending if the order flag is true', async () => {
    order.amount = 6969;
    order.flag = true;

    mockAPIClient.callAPI.mockResolvedValue(new APIResponse('success', order));
    await processor.process(order);
    expect(order.status).toBe('pending');
  });
});
