import React, { useEffect, useState } from 'react';
import { createShipment, getShirts, getShipments } from '../lib/api';
import api from '../lib/api';
import { Package, Truck, CircleCheck, Box, ArrowRight } from 'lucide-react';

export default function Shipments() {
    const [shirts, setShirts] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [selected, setSelected] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expanded, setExpanded] = useState(null);

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
        setIsSubmitting(true);
        try {
            const tracking = `SH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const { data: shipment } = await createShipment({ tracking_code: tracking });

            for (const serial of selected) {
                await api.post(`/scan/?action=ship&serial=${serial}&shipment_id=${shipment.id}`);
            }

            // Artificial delay for UX
            await new Promise(r => setTimeout(r, 600));

            setSelected([]);
            loadData();
        } catch (e) {
            alert('Error: ' + e.message);
        } finally {
            setIsSubmitting(false);
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Shipments</h1>
                    <p className="text-slate-500 mt-1">Group items and dispatch them.</p>
                </div>
            </div>

            {/* Creation Section */}
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Package className="text-indigo-600" />
                        Select Items to Ship
                    </h2>
                    <button
                        disabled={selected.length === 0 || isSubmitting}
                        onClick={handleCreateShipment}
                        className={`
              px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 shadow-lg transition-all
              ${selected.length === 0
                                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 shadow-indigo-300'}
            `}
                    >
                        {isSubmitting ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Truck className="w-5 h-5" />
                                Create Shipment ({selected.length})
                            </>
                        )}
                    </button>
                </div>

                {shirts.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No inventory available to ship.</p>
                        <p className="text-slate-400 text-sm mt-1">Add items to inventory first.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {shirts.map(shirt => {
                            const isSelected = selected.includes(shirt.serial_number);
                            return (
                                <div
                                    key={shirt.id}
                                    onClick={() => toggleSelect(shirt.serial_number)}
                                    className={`
                    cursor-pointer p-4 rounded-xl border-2 transition-all relative overflow-hidden group
                    ${isSelected
                                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}
                  `}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 text-indigo-600 bg-indigo-100 rounded-full pb-0.5">
                                            <CircleCheck className="w-4 h-4" />
                                        </div>
                                    )}
                                    <p className="font-mono text-xs text-slate-400 mb-1">{shirt.serial_number}</p>
                                    <p className="font-bold text-slate-700">{shirt.type}</p>
                                    <p className="text-sm text-slate-500">Size: {shirt.size}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* History List */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 px-1">Active Shipments</h2>
                {shipments.length === 0 ? (
                    <p className="text-slate-500 text-center py-8 italic">No shipments created yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {shipments.map(shipment => {
                            const isExpanded = expanded === shipment.id;
                            return (
                                <div
                                    key={shipment.id}
                                    onClick={() => setExpanded(isExpanded ? null : shipment.id)}
                                    className={`
                                        bg-white p-5 rounded-2xl border border-slate-200 transition-all duration-300 cursor-pointer
                                        ${isExpanded ? 'ring-2 ring-indigo-500 shadow-xl' : 'hover:border-indigo-200 hover:shadow-lg'}
                                    `}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`
                                            p-3 rounded-xl transition-colors duration-300
                                            ${isExpanded ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}
                                        `}>
                                            <Box className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tracking Code</p>
                                                    <p className="font-bold text-slate-800 font-mono text-lg">{shipment.tracking_code}</p>
                                                </div>
                                                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                                                    <ArrowRight className="w-5 h-5 text-slate-300" />
                                                </div>
                                            </div>
                                            <div className="mt-3 flex justify-between items-center text-xs text-slate-500">
                                                <span>{new Date(shipment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                <div className="flex gap-2">
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">{shipment.shirts?.length || 0} Items</span>
                                                    <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-medium">In Transit</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="mt-6 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 fade-in duration-300">
                                            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                                <Package className="w-4 h-4" /> Shipment Contents
                                            </h4>

                                            {(!shipment.shirts || shipment.shirts.length === 0) ? (
                                                <p className="text-sm text-slate-400 italic">No items recorded in this shipment.</p>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                    {shipment.shirts.map(shirt => (
                                                        <div key={shirt.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 bg-white border border-slate-200">
                                                                {shirt.size}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-700">{shirt.serial_number}</p>
                                                                <p className="text-xs text-slate-500 capitalize">{shirt.color} • {shirt.type}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
