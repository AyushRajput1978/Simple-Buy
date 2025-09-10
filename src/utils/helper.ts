// import * as React from "react";

import { showToast } from '../redux/reducer/toastSlice';
import { store } from '../redux/store';

// import type { OrderStatus } from 'type';

type NamedEl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type PhoneField = 'phone_number' | 'phone_no';
type PostalField = 'postalCode';

// export const valuehandler = (arr, value) => arr?.find((opt) => opt.value === value);

export function handleChange<T extends Record<string, unknown>>(
  e: React.ChangeEvent<NamedEl>,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
): void {
  const { name, value } = e.currentTarget;

  let nextValue: string;

  if ((['phone_number', 'phone_no'] as const).includes(name as PhoneField)) {
    const numeric = value.replace(/\D/g, '');
    nextValue = numeric.slice(0, 10);
  } else if (name === ('postalCode' as PostalField)) {
    const numeric = value.replace(/\D/g, '');
    nextValue = numeric.slice(0, 5);
  } else {
    nextValue = value || '';
  }

  // Cast is used because `name` is a runtime string; this preserves T in state.
  setFormData((prev) => ({ ...prev, [name]: nextValue }) as T);
}

export const toast = (message: string, success = true) => {
  store.dispatch(showToast({ message, success }));
};

export const capitaliseFirstAlphabet = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const ORDER_STATUSES = [
  'confirmed',
  'dispatched',
  'out for delivery',
  'delivered',
  'cancelled',
] as const;

export const getStatusColor = {
  confirmed: 'warning',
  dispatched: 'secondary',
  'out for delivery': 'info',
  delivered: 'success',
  cancelled: 'danger',
};
export const getStatusLabel = {
  confirmed: 'Order Placed',
  dispatched: 'Shipped',
  'out for delivery': 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const STATS_STATUSES = [
  'totalCustomers',
  'totalOrders',
  'totalRevenue',
  'totalProductCategories',
  'totalProducts',
];
