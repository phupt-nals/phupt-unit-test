import { IOrderProcessor } from '../interfaces/IOrderProcessor';
import { Order } from '../models/Order';
import { FileService } from '../../../services/FileService';

export class OrderProcessorA implements IOrderProcessor {
  async process(order: Order, userId: number): Promise<void> {
    const csvFile = `orders_type_A_${userId}_${Date.now()}.csv`;
    let csvData = `ID,Type,Amount,Flag,Status,Priority\n`;
    csvData += `${order.id},${order.type},${order.amount},${order.flag ? 'true' : 'false'},${order.status},${order.priority}\n`;

    if (order.amount > 150) {
      csvData += ',,,,Note,High value order\n';
    }

    try {
      await FileService.writeCSV(csvFile, csvData);
      order.status = 'exported';
    } catch {
      order.status = 'export_failed';
    }
  }
}
