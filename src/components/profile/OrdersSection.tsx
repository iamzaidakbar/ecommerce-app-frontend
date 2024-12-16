"use client";

import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { axiosInstance } from "@/lib/axios";

interface Order {
  id: string;
  status: string;
  createdAt: string;
  total: number;
}

export default function OrdersSection() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await axiosInstance.get('/orders');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <div className="text-[11px] text-gray-500">
          You haven&apos;t placed any orders yet
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order: Order) => (
        <div key={order.id} className="border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[11px]">ORDER #{order.id}</div>
            <div className="text-[11px] uppercase">{order.status}</div>
          </div>
          <div className="text-[11px] text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
          <div className="text-[11px]">
            Total: ${order.total.toFixed(2)}
          </div>
          <Button variant="secondary" className="text-[11px]">
            VIEW DETAILS
          </Button>
        </div>
      ))}
    </div>
  );
} 