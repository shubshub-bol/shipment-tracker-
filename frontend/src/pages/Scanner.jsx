import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { scanAction, getShirts } from '../lib/api';
import { Scan, TriangleAlert, CircleCheck, Search, CircleHelp } from 'lucide-react';

export default function Scanner() {
    const [scanResult, setScanResult] = useState(null);
    const [lastScanned, setLastScanned] = useState('');

    useEffect(() => {
        let html5QrcodeScanner = null;

        // Debounce initialization to handle React Strict Mode double-render
        const initTimer = setTimeout(() => {
            // Force cleanup before init
            const readerElement = document.getElementById("reader");
            if (readerElement) {
                readerElement.innerHTML = "";
            }

            html5QrcodeScanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        }, 300); // 300ms delay to let Strict Mode cycles settle

        function onScanSuccess(decodedText, decodedResult) {
            if (decodedText !== lastScanned) {
                setLastScanned(decodedText);
                handleScan(decodedText);
            }
        }

        function onScanFailure(error) {
            // handle scan failure
        }

        return () => {
            clearTimeout(initTimer);
            if (html5QrcodeScanner) {
                html5QrcodeScanner.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode scanner. ", error);
                });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    const handleScan = async (text) => {
        try {
            // Always verify first
            const { data } = await getShirts();
            const item = data.find(s => s.serial_number === text);
            setScanResult({ type: 'info', data: item || { error: 'Not Found' } });
        } catch (e) {
            setScanResult({ type: 'error', message: 'Error processing scan.' });
        }
    };

    const acceptItem = async () => {
        if (!scanResult?.data?.serial_number) return;
        try {
            await scanAction('accept', scanResult.data.serial_number);
            setScanResult({
                type: 'success',
                message: `Item ${scanResult.data.serial_number} Accepted!`
            });
            setTimeout(() => {
                setScanResult(null);
                setLastScanned('');
            }, 1500);
        } catch (e) {
            alert('Failed to accept item');
        }
    };

    const markAsDefective = async () => {
        if (!scanResult?.data?.serial_number) return;
        try {
            await scanAction('damage', scanResult.data.serial_number);
            setScanResult({
                type: 'success',
                message: `Item ${scanResult.data.serial_number} marked as damaged.`
            });
            // Optional: reset after delay
            setTimeout(() => {
                setScanResult(null);
                setLastScanned('');
            }, 3000);
        } catch (e) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center justify-center gap-3">
                    <Scan className="w-8 h-8 text-indigo-600" />
                    Scanner
                </h1>
                <p className="text-slate-500">Point your camera at an item QR code to verify or update.</p>
            </div>

            {/* Scanner Box */}
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
                <div id="reader" className="rounded-xl overflow-hidden"></div>

                {/* Visual Decorative Corners */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-indigo-600 rounded-tl-xl pointer-events-none"></div>
                <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-indigo-600 rounded-tr-xl pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-indigo-600 rounded-bl-xl pointer-events-none"></div>
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-indigo-600 rounded-br-xl pointer-events-none"></div>
            </div>

            {/* Result Display */}
            {scanResult && (
                <div className={`p-6 rounded-2xl border-l-4 shadow-lg animate-in slide-in-from-bottom-2 ${scanResult.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' :
                    scanResult.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' :
                        'bg-indigo-50 border-indigo-500 text-indigo-700'
                    }`}>
                    {scanResult.type === 'info' ? (
                        scanResult.data.error ? (
                            <div className="flex items-center gap-3">
                                <CircleHelp className="w-6 h-6" />
                                <span className="font-semibold">Item Not Found</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
                                        <Search className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{scanResult.data.serial_number}</h3>
                                        <div className="flex gap-3 text-sm opacity-80 mb-2">
                                            <span>Size: {scanResult.data.size}</span>
                                            <span>•</span>
                                            <span className="capitalize">{scanResult.data.type}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2 mb-2 w-full min-w-[200px]">
                                            <span className="text-slate-500">Color</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: scanResult.data.color.toLowerCase() }}></div>
                                                <span className="font-medium capitalize">{scanResult.data.color}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Status</span>
                                            <span className="font-medium capitalize">{scanResult.data.status.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2 border-t border-indigo-100">
                                    <button
                                        onClick={() => {
                                            setScanResult(null);
                                            setLastScanned('');
                                        }}
                                        className="py-2 px-4 text-sm font-medium text-slate-600 bg-white rounded-lg hover:bg-slate-50 border border-slate-200"
                                    >
                                        Scan Next
                                    </button>

                                    {/* Action Logic */}
                                    {scanResult.data.status === 'shipped' ? (
                                        <>
                                            <button
                                                onClick={acceptItem}
                                                className="flex-1 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm shadow-emerald-200 flex items-center justify-center gap-2"
                                            >
                                                <CircleCheck size={16} /> Accept
                                            </button>
                                            <button
                                                onClick={markAsDefective}
                                                className="flex-1 py-2 text-sm font-medium text-rose-600 bg-white rounded-lg hover:bg-rose-50 border border-rose-200 flex items-center justify-center gap-2"
                                            >
                                                <TriangleAlert size={14} /> Defective
                                            </button>
                                        </>
                                    ) : (scanResult.data.status === 'in_stock' || scanResult.data.status === 'accepted') ? (
                                        <div className={`flex-1 py-2 text-sm font-medium rounded-lg border flex items-center justify-center gap-2 ${scanResult.data.status === 'accepted' ? 'text-blue-700 bg-blue-50 border-blue-100' : 'text-emerald-700 bg-emerald-50 border-emerald-100'
                                            }`}>
                                            <CircleCheck size={14} /> Verified: {scanResult.data.status === 'accepted' ? 'Received' : 'In Stock'}
                                        </div>
                                    ) : (
                                        <div className="flex-1 py-2 text-sm font-medium text-rose-400 bg-rose-50 rounded-lg border border-rose-100 flex items-center justify-center gap-2 cursor-not-allowed">
                                            <TriangleAlert size={14} /> Already Damaged
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="flex items-center gap-3">
                            {scanResult.type === 'success' ? <CircleCheck /> : <TriangleAlert />}
                            <span className="font-medium">{scanResult.message}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
