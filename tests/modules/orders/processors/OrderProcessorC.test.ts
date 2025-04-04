import { OrderProcessorC } from '@src/modules/orders//processors/OrderProcessorC';
import { Order } from '@src/modules/orders/models/Order';

describe('OrderProcessorA', () => {
  let order: Order;
  let processor: OrderProcessorC;

  beforeEach(() => {
    order = new Order(1, 'C', 100, true);
    processor = new OrderProcessorC();
  });

  it('should update order status to completed when the flag is true', async () => {
    await processor.process(order);
    expect(order.status).toBe('completed');
  });

  it('should update order status to completed when the flag is false', async () => {
    order.flag = false;

    await processor.process(order);
    expect(order.status).toBe('in_progress');
  });
});
