import React, { useEffect, useState } from 'react';
import { createShirt, getShirts, scanAction } from '../lib/api';
import QRCode from 'qrcode'; // Client side QR generation for display
import { Plus, Tag, Search, Filter, CircleAlert, CircleCheck, Package, Scan } from 'lucide-react';

export default function Shirts() {
    const [shirts, setShirts] = useState([]);
    const [newShirt, setNewShirt] = useState({ serial_number: '', size: 'M', type: 'buttoned', color: 'White' });
    const [qrCode, setQrCode] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadShirts();
    }, []);

    const loadShirts = async () => {
        const { data } = await getShirts();
        setShirts(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createShirt(newShirt);
            setNewShirt({ serial_number: '', size: 'M', type: 'buttoned', color: 'White' });
            loadShirts();
            setShowForm(false);
        } catch (error) {
            console.error(error);
            alert(`Error creating shirt: ${error.response?.data?.detail || error.message}`);
        }
    };

    const generateQR = async (text) => {
        try {
            const url = await QRCode.toDataURL(text);
            setQrCode(url);
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'in_stock': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'damaged': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'accepted': return 'bg-purple-50 text-purple-700 border-purple-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Inventory</h1>
                    <p className="text-slate-500 mt-1">Manage your stock and track items.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2 font-medium"
                >
                    <Plus size={18} />
                    Add New Shirt
                </button>
            </div>

            {/* Creation Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 mb-6 animate-in zoom-in-95 duration-200">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Tag className="text-indigo-600" size={20} />
                        New Item Details
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Serial Number</label>
                            <input
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Auto-generated if empty"
                                value={newShirt.serial_number}
                                onChange={e => setNewShirt({ ...newShirt, serial_number: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Size</label>
                            <select
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newShirt.size}
                                onChange={e => setNewShirt({ ...newShirt, size: e.target.value })}
                            >
                                <option value="S">Small</option>
                                <option value="M">Medium</option>
                                <option value="L">Large</option>
                                <option value="XL">Extra Large</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
                            <select
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newShirt.type}
                                onChange={e => setNewShirt({ ...newShirt, type: e.target.value })}
                            >
                                <option value="hooded">Hooded</option>
                                <option value="buttoned">Buttoned</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Color</label>
                            <select
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newShirt.color}
                                onChange={e => setNewShirt({ ...newShirt, color: e.target.value })}
                            >
                                <option value="White">White</option>
                                <option value="Black">Black</option>
                                <option value="Blue">Blue</option>
                                <option value="Red">Red</option>
                                <option value="Green">Green</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition font-medium h-[42px]">
                            Save Item
                        </button>
                    </form>
                </div>
            )}

            {/* QR Overlay */}
            {qrCode && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={() => setQrCode(null)}>
                    <div className="bg-white p-8 rounded-3xl shadow-2xl transform transition-transform scale-100 text-center max-w-sm w-full" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Item QR Code</h3>
                        <p className="text-slate-500 mb-6 text-sm">Scan this code to update status.</p>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-inner inline-block mb-6">
                            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                        </div>
                        <button
                            onClick={() => setQrCode(null)}
                            className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition"
                        >
                            Close Viewer
                        </button>
                    </div>
                </div>
            )}

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                <th className="p-4 pl-6">Serial Number</th>
                                <th className="p-4">Details</th>
                                <th className="p-4">Color</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {shirts.map((shirt) => (
                                <tr key={shirt.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 pl-6 font-mono text-sm text-slate-600 font-medium">
                                        {shirt.serial_number}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-600">{shirt.size}</span>
                                            <span className="text-slate-700 capitalize text-sm">{shirt.type}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: shirt.color.toLowerCase() }}></div>
                                            {shirt.color}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1.5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border w-fit flex items-center gap-1.5 ${shirt.status === 'in_stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                shirt.status === 'damaged' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                    shirt.status === 'accepted' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                        'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${shirt.status === 'in_stock' ? 'bg-emerald-500' :
                                                    shirt.status === 'damaged' ? 'bg-rose-500' :
                                                        shirt.status === 'accepted' ? 'bg-purple-500' :
                                                            'bg-blue-500'
                                                    }`}></span>
                                                {shirt.status === 'in_stock' ? 'In Stock' :
                                                    shirt.status === 'damaged' ? 'Damaged' :
                                                        shirt.status === 'accepted' ? 'Accepted' :
                                                            'Shipped'}
                                            </span>
                                            {shirt.status === 'shipped' && shirt.shipment && (
                                                <span className="text-xs text-slate-500 font-mono flex items-center gap-1 px-1">
                                                    <Package size={10} className="text-slate-400" />
                                                    {shirt.shipment.tracking_code}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex justify-end items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => generateQR(shirt.serial_number)}
                                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 px-3 py-1.5 hover:bg-indigo-50 rounded"
                                            >
                                                <Scan size={14} /> View QR
                                            </button>
                                            {shirt.status === 'in_stock' && (
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm('Mark this shirt as defective?')) {
                                                            try {
                                                                console.log(`Marking defective: ${shirt.serial_number}`);
                                                                await scanAction('damage', shirt.serial_number);
                                                                loadShirts();
                                                            } catch (e) {
                                                                console.error(e);
                                                                alert(`Failed to mark defective: ${e.response?.data?.detail || e.message}`);
                                                            }
                                                        }
                                                    }}
                                                    className="text-rose-500 hover:text-rose-700 text-sm font-medium flex items-center gap-1 px-3 py-1.5 hover:bg-rose-50 rounded"
                                                >
                                                    <CircleAlert size={14} /> Defective
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {shirts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-400">
                                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No items found in inventory.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
