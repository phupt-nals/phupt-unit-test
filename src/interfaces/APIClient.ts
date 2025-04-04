// File: APIClient.ts
import { APIResponse } from '../utils/APIResponse';

export interface APIClient {
  callAPI(orderId: number): Promise<APIResponse>;
}
