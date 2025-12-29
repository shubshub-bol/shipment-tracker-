import React, { useEffect, useState } from 'react';
import { getShirts, getShipments } from '../lib/api';
import { Shirt, Package, AlertTriangle, Truck } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({ total: 0, damaged: 0, shipped: 0, shipmentsCount: 0 });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const { data: shirts } = await getShirts();
            const { data: shipments } = await getShipments();

            setStats({
                total: shirts.length,
                damaged: shirts.filter(s => s.status === 'damaged').length,
                shipped: shirts.filter(s => s.status === 'shipped').length,
                shipmentsCount: shipments.length
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <Shirt className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Shirts</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Active Shipments</p>
                        <p className="text-2xl font-bold">{stats.shipmentsCount}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Shipped Items</p>
                        <p className="text-2xl font-bold">{stats.shipped}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-full">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Damaged</p>
                        <p className="text-2xl font-bold">{stats.damaged}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
