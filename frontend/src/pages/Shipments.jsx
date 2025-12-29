import React, { useEffect, useState } from 'react';
import { createShipment, getShirts, getShipments } from '../lib/api';
import api from '../lib/api';
import { Package, Truck, CheckCircle, Box } from 'lucide-react';

export default function Shipments() {
    const [shirts, setShirts] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { data: shirtsData } = await getShirts();
            setShirts(shirtsData.filter(s => s.status === 'in_stock' && !s.shipment_id));

            const { data: shipmentsData } = await getShipments();
            setShipments(shipmentsData);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreateShipment = async () => {
        if (selected.length === 0) return;
        try {
            // 1. Create Shipment
            const tracking = `SH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const { data: shipment } = await createShipment({ tracking_code: tracking });

            // 2. Add items to shipment
            for (const serial of selected) {
                await api.post(`/scan/?action=ship&serial=${serial}&shipment_id=${shipment.id}`);
            }

            alert(`Shipment ${tracking} created with ${selected.length} items!`);
            setSelected([]);
            loadData();
        } catch (e) {
            alert('Error: ' + e.message);
        }
    };

    const toggleSelect = (serial) => {
        if (selected.includes(serial)) {
            setSelected(selected.filter(s => s !== serial));
        } else {
            setSelected([...selected, serial]);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Shipments</h1>

            {/* Create Shipment Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold">Available for Shipping</h2>
                    <button
                        disabled={selected.length === 0}
                        onClick={handleCreateShipment}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Truck className="w-4 h-4" />
                        Create Shipment ({selected.length})
                    </button>
                </div>

                {shirts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No items available to ship.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {shirts.map(shirt => (
                            <div
                                key={shirt.id}
                                onClick={() => toggleSelect(shirt.serial_number)}
                                className={`cursor-pointer p-4 border rounded-lg relative ${selected.includes(shirt.serial_number) ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                                    }`}
                            >
                                {selected.includes(shirt.serial_number) && (
                                    <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-blue-600" />
                                )}
                                <p className="font-mono text-xs text-gray-500">{shirt.serial_number}</p>
                                <p className="font-medium">{shirt.size} - {shirt.type}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Active Shipments List */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="font-semibold mb-4">Active Shipments</h2>
                {shipments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No shipments created yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {shipments.map(shipment => (
                            <div key={shipment.id} className="p-4 border border-gray-200 rounded-lg flex items-start gap-3">
                                <div className="p-2 bg-orange-50 text-orange-600 rounded">
                                    <Box className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{shipment.tracking_code}</p>
                                    {/* Note: backend might need to return shirts count if not eager loaded, or we fetch details. 
                       For now, assuming basic data. */}
                                    <p className="text-sm text-gray-500">Created: {new Date(shipment.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
