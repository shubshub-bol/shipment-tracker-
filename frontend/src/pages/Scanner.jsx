import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import { scanAction } from '../lib/api';
import { Check, X } from 'lucide-react';

export default function Scanner() {
    const [scanResult, setScanResult] = useState(null);
    const [lastScanned, setLastScanned] = useState(null);
    const [mode, setMode] = useState('view'); // view, damage, ship (requires shipment ID logic, simplified here)

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(decodedText) {
            handleScan(decodedText);
            // Optional: Pause scanner or debounce
        }

        function onScanFailure(error) {
            // handle scan failure, usually better to ignore and keep scanning.
        }

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, [mode]);

    const handleScan = async (serial) => {
        if (lastScanned === serial) return; // Debounce same code
        setLastScanned(serial);

        try {
            let action = 'view';
            if (mode === 'damage') action = 'damage';

            const { data } = await scanAction(action, serial);
            setScanResult({ success: true, item: data, message: `Scanned ${serial}` });
        } catch (e) {
            setScanResult({ success: false, message: `Error scanning ${serial}: ${e.response?.data?.detail || e.message}` });
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">QR Scanner</h1>

            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => setMode('view')}
                    className={`px-4 py-2 rounded-full ${mode === 'view' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    View / Check
                </button>
                <button
                    onClick={() => setMode('damage')}
                    className={`px-4 py-2 rounded-full ${mode === 'damage' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                >
                    Mark Damaged
                </button>
            </div>

            <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-sm">
                <div id="reader"></div>
            </div>

            {scanResult && (
                <div className={`p-4 rounded-lg text-center ${scanResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <p className="font-bold flex items-center justify-center gap-2">
                        {scanResult.success ? <Check /> : <X />}
                        {scanResult.message}
                    </p>
                    {scanResult.item && (
                        <div className="mt-2 text-sm">
                            {scanResult.item.size} - {scanResult.item.type} ({scanResult.item.status})
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
