import { OrderProcessorA } from '@src/modules/orders/processors/OrderProcessorA';
import { Order } from '@src/modules/orders/models/Order';
import { FileService } from '@src/services/FileService';

jest.mock('@src/services/FileService');

const dateNow = 1627818240000;
jest.spyOn(Date, 'now').mockReturnValue(dateNow);

describe('OrderProcessorA', () => {
  let order: Order;
  let processor: OrderProcessorA;
  let userId: number;

  beforeEach(() => {
    order = new Order(1, 'A', 100, true);
    userId = 123;
    processor = new OrderProcessorA();
  });

  it('should write CSV and update order status to exported when the amount is less than or equal 150 and the flag is true', async () => {
    let csvData = `ID,Type,Amount,Flag,Status,Priority\n`;
    csvData += `${order.id},${order.type},${order.amount},true,${order.status},${order.priority}\n`;

    await processor.process(order, userId);
    expect(FileService.writeCSV).toHaveBeenCalledWith(`orders_type_A_${userId}_${dateNow}.csv`, csvData);
    expect(order.status).toBe('exported');
  });

  it('should write CSV and update order status to exported when the amount is greater than 150 and the flag is false', async () => {
    order.amount = 151;
    order.flag = false;

    let csvData = `ID,Type,Amount,Flag,Status,Priority\n`;
    csvData += `${order.id},${order.type},${order.amount},false,${order.status},${order.priority}\n`;
    csvData += ',,,,Note,High value order\n';

    await processor.process(order, userId);
    expect(FileService.writeCSV).toHaveBeenCalledWith(`orders_type_A_${userId}_${dateNow}.csv`, csvData);
    expect(order.status).toBe('exported');
  });

  it('should set status to export_failed on write error', async () => {
    (FileService.writeCSV as jest.Mock).mockRejectedValue(new Error('File write error'));
    await processor.process(order, userId);
    expect(order.status).toBe('export_failed');
  });
});
