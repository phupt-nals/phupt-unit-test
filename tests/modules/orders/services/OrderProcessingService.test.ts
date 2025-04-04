import { OrderProcessingService } from '@src/modules/orders/services/OrderProcessingService';
import { DatabaseService } from '@src/interfaces/DatabaseService';
import { APIClient } from '@src/interfaces/APIClient';
import { Order } from '@src/modules/orders/models/Order';
import { OrderProcessorFactory } from '@src/modules/orders/processors/OrderProcessorFactory';
import { IOrderProcessor } from '@src/modules/orders/interfaces/IOrderProcessor';
import { DatabaseException } from '@src/exceptions/DatabaseException';

jest.mock('@src/modules/orders/processors/OrderProcessorFactory');

const mockAPIClient: jest.Mocked<APIClient> = {
  callAPI: jest.fn(),
};
const mockDbService: jest.Mocked<DatabaseService> = {
  getOrdersByUser: jest.fn(),
  updateOrderStatus: jest.fn(),
};

describe('OrderProcessingService', () => {
  let service: OrderProcessingService;
  let mockProcessor: IOrderProcessor;
  let orderA: Order;
  const userId: number = 69;

  beforeEach(() => {
    service = new OrderProcessingService(mockDbService, mockAPIClient);

    mockProcessor = { process: jest.fn() };

    orderA = new Order(1, 'A', 100, false);
  });

  it('should return false if get orders by user failed', async () => {
    mockDbService.getOrdersByUser.mockRejectedValue(new Error('DB error'));

    const result = await service.processOrders(userId);

    expect(result).toBe(false);
  });

  it('should return empty array if no orders found', async () => {
    mockDbService.getOrdersByUser.mockResolvedValue([]);

    const result = await service.processOrders(userId);

    expect(result).toHaveLength(0);
  });

  it('should set status to unknown_type if order type is not valid', async () => {
    mockDbService.getOrdersByUser.mockResolvedValue([orderA]);
    mockDbService.updateOrderStatus.mockResolvedValue(true);

    (OrderProcessorFactory.createProcessor as jest.Mock).mockReturnValue(undefined);

    await service.processOrders(userId);

    expect(orderA.status).toBe('unknown_type');
    expect(mockDbService.updateOrderStatus).toHaveBeenCalledWith(orderA.id, 'unknown_type', orderA.priority);
  });

  it('should process the order correctly if order type is valid', async () => {
    mockDbService.getOrdersByUser.mockResolvedValue([orderA]);
    mockDbService.updateOrderStatus.mockResolvedValue(true);

    (OrderProcessorFactory.createProcessor as jest.Mock).mockReturnValue(mockProcessor);

    await service.processOrders(userId);

    expect(mockProcessor.process).toHaveBeenCalledWith(orderA, userId);
  });

  it('should set the priority to high if the amount is greater than or equal 200', async () => {
    orderA.amount = 269;

    mockDbService.getOrdersByUser.mockResolvedValue([orderA]);
    mockDbService.updateOrderStatus.mockResolvedValue(true);

    (OrderProcessorFactory.createProcessor as jest.Mock).mockReturnValue(mockProcessor);

    await service.processOrders(userId);

    expect(orderA.priority).toBe('high');
    expect(mockDbService.updateOrderStatus).toHaveBeenCalledWith(orderA.id, orderA.status, 'high');
  });

  it('should set the priority to low if the amount is less than 200', async () => {
    orderA.amount = 169;

    mockDbService.getOrdersByUser.mockResolvedValue([orderA]);
    mockDbService.updateOrderStatus.mockResolvedValue(true);

    (OrderProcessorFactory.createProcessor as jest.Mock).mockReturnValue(mockProcessor);

    await service.processOrders(userId);

    expect(orderA.priority).toBe('low');
    expect(mockDbService.updateOrderStatus).toHaveBeenCalledWith(orderA.id, orderA.status, 'low');
  });

  it('should set the status db_error if update order throw the database exception', async () => {
    mockDbService.getOrdersByUser.mockResolvedValue([orderA]);
    mockDbService.updateOrderStatus.mockRejectedValue(new DatabaseException());

    await service.processOrders(userId);

    expect(orderA.status).toBe('db_error');
  });

  it('should not change the status if update order throw the unknown exception', async () => {
    mockDbService.getOrdersByUser.mockResolvedValue([orderA]);
    mockDbService.updateOrderStatus.mockRejectedValue(new Error());

    (OrderProcessorFactory.createProcessor as jest.Mock).mockReturnValue(mockProcessor);

    await service.processOrders(userId);

    expect(orderA.status).toBe('new');
  });
});
