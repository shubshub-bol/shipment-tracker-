import React, { useEffect, useState } from 'react';
import { createShirt, getShirts } from '../lib/api';
import QRCode from 'qrcode'; // Client side QR generation for display

export default function Shirts() {
    const [shirts, setShirts] = useState([]);
    const [form, setForm] = useState({ age: '', size: 'M', type: 'buttoned', serial_number: '' });
    const [qrUrl, setQrUrl] = useState(null);

    useEffect(() => {
        loadShirts();
    }, []);

    const loadShirts = async () => {
        try {
            const { data } = await getShirts();
            setShirts(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const serial = form.serial_number || `SN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            await createShirt({ ...form, serial_number: serial });
            setForm({ age: '', size: 'M', type: 'buttoned', serial_number: '' });
            loadShirts();
        } catch (e) {
            alert('Error creating shirt: ' + e.message);
        }
    };

    const generateQR = async (text) => {
        try {
            const url = await QRCode.toDataURL(text);
            setQrUrl(url);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Inventory</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
                    <h2 className="font-semibold mb-4">Add New Shirt</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Serial Number (Optional)</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Auto-generated if empty"
                                value={form.serial_number}
                                onChange={e => setForm({ ...form, serial_number: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Age (1-99)</label>
                            <input
                                type="number"
                                min="1" max="99"
                                required
                                className="w-full p-2 border rounded"
                                value={form.age}
                                onChange={e => setForm({ ...form, age: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Size</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={form.size}
                                onChange={e => setForm({ ...form, size: e.target.value })}
                            >
                                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-4">
                            {['buttoned', 'closed', 'hooded'].map(t => (
                                <label key={t} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={t}
                                        checked={form.type === t}
                                        onChange={e => setForm({ ...form, type: e.target.value })}
                                    />
                                    <span className="capitalize">{t}</span>
                                </label>
                            ))}
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Shirt</button>
                    </form>
                </div>

                <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-medium text-gray-500">Serial</th>
                                <th className="p-4 font-medium text-gray-500">Details</th>
                                <th className="p-4 font-medium text-gray-500">Status</th>
                                <th className="p-4 font-medium text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {shirts.map(shirt => (
                                <tr key={shirt.id}>
                                    <td className="p-4 font-mono">{shirt.serial_number}</td>
                                    <td className="p-4">
                                        {shirt.size} - {shirt.type} (Age: {shirt.age})
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${shirt.status === 'damaged' ? 'bg-red-100 text-red-700' :
                                                shirt.status === 'shipped' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {shirt.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => generateQR(shirt.serial_number)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Show QR
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {qrUrl && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" onClick={() => setQrUrl(null)}>
                    <div className="bg-white p-6 rounded-lg text-center space-y-4" onClick={e => e.stopPropagation()}>
                        <img src={qrUrl} alt="QR Code" className="mx-auto w-48 h-48" />
                        <p className="text-sm text-gray-500">Scan this code to track item</p>
                        <button onClick={() => setQrUrl(null)} className="text-sm underline">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
