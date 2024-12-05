export interface OrderItem {
    itemId: string;
    lotNo: string;
    quantity: number;
  }
  
  export interface OrderResponse {
    success: boolean;
    message: string;
    orderDetails?: OrderItem[];
    error?: string;
    details?: string;
  }