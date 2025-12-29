import React, { useEffect, useState } from 'react';
import { getShirts, getShipments } from '../lib/api';
import { Shirt, Package, TriangleAlert, Truck } from 'lucide-react';

function StatCard({ title, value, icon: Icon, color, subtext }) {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        red: 'bg-rose-50 text-rose-600 border-rose-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorStyles[color]} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                </div>
                {subtext && <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-full">{subtext}</span>}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState({ total: 0, damaged: 0, shipped: 0, shipmentsCount: 0, todayShipments: 0 });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const { data: shirts } = await getShirts();
            const { data: shipments } = await getShipments();

            const today = new Date().toDateString();
            const todayCount = shipments.filter(s => new Date(s.created_at).toDateString() === today).length;

            setStats({
                total: shirts.length,
                damaged: shirts.filter(s => s.status === 'damaged').length,
                shipped: shirts.filter(s => s.status === 'shipped').length,
                shipmentsCount: shipments.length,
                todayShipments: todayCount
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-2">Welcome back! Here is what's happening today.</p>
                </div>
            </div>

            {/* Goal Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl shadow-xl shadow-indigo-200 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-10">
                    <Truck size={150} />
                </div>
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-lg font-medium text-indigo-100 mb-6 flex items-center gap-2">
                        <Truck className="w-5 h-5" /> Daily Target
                    </h2>

                    <div className="flex items-end gap-3 mb-4">
                        <span className="text-5xl font-bold">{stats.todayShipments}</span>
                        <span className="text-xl text-indigo-200 mb-2">/ 4 Shipments</span>
                    </div>

                    <div className="w-full bg-black/20 rounded-full h-3 mb-4 backdrop-blur-sm">
                        <div
                            className={`h-3 rounded-full transition-all duration-1000 ease-out ${stats.todayShipments >= 4 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-white'}`}
                            style={{ width: `${Math.min(100, (stats.todayShipments / 4) * 100)}%` }}
                        ></div>
                    </div>

                    <p className="text-sm text-indigo-100 font-medium">
                        {stats.todayShipments >= 4
                            ? "🎉 Great job! You've hit your daily goal."
                            : `Keep going! ${4 - stats.todayShipments} more to reach the target.`}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Inventory" value={stats.total} icon={Shirt} color="blue" />
                <StatCard title="Shipped Items" value={stats.shipped} icon={Package} color="green" />
                <StatCard title="Active Shipments" value={stats.shipmentsCount} icon={Truck} color="orange" />
                <StatCard title="Defective Items" value={stats.damaged} icon={TriangleAlert} color="red" subtext="Action Needed" />
            </div>
        </div>
    );
}
