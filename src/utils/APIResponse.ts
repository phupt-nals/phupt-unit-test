// File: APIResponse.ts
import { Order } from '../modules/orders/models/Order';

export class APIResponse {
  status: string;
  data: Order;

  constructor(status: string, data: Order) {
    this.status = status;
    this.data = data;
  }
}
