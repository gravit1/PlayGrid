import api from './api';
import { Order } from '../types';

export interface CreateOrderPayloadItem {
  gameId: number;
  title: string;
  price: number;
  discount: number;
}

export const createOrder = async (items: CreateOrderPayloadItem[], paymentMethod: string = 'CREDIT_CARD'): Promise<Order> => {
  const response = await api.post<Order>('/orders', { items, paymentMethod });
  return response.data;
};

export const getUserOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>('/orders');
  return response.data;
};

export const getOrderById = async (id: number): Promise<Order> => {
  const response = await api.get<Order>(`/orders/${id}`);
  return response.data;
};
