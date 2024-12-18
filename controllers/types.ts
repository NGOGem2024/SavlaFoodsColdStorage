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

  interface CustomerGroup {
    FK_CUSTOMER_ID: number;
    DISP_NAME: string;
    DEF: number;
    FK_CUST_GROUP_ID: number;
    CUSTOMER_NAME: string;
  }