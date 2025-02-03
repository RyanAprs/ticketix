import React, { useState, useRef, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, QrCode, AlertCircle, CheckCircle } from "lucide-react";

const TicketScanner: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<any>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      scannerRef.current.id,
      {
        fps: 10,
        qrbox: 250,
        rememberLastUsedCamera: true,
      },
      false
    );

    const onScanSuccess = (decodedText: string) => {
      try {
        const parsedData = JSON.parse(decodedText);
        setScanResult(decodedText);
        setTicketData(parsedData);
        setError(null);
        console.log("Parsed Ticket Data:", parsedData);

        scanner.clear();
      } catch (err) {
        setError("Invalid QR Code format");
        setScanResult(null);
        setTicketData(null);
      }
    };

    const onScanError = (errorMessage: string) => {
      console.warn(`Scan error: ${errorMessage}`);
    };

    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center space-x-4">
          <Camera className="w-6 h-6" />
          <h2 className="text-xl font-semibold flex-grow">Ticket Scanner</h2>
          <QrCode className="w-6 h-6" />
        </div>

        {/* Scanner Container */}
        <div className="p-6 space-y-4">
          <div
            ref={scannerRef}
            id="reader"
            className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden"
          />

          {/* Scan Results */}
          <div className="mt-4 space-y-2">
            {error && (
              <div className="flex items-center text-red-600 space-x-2">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            {ticketData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center text-green-600 space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <h3 className="font-semibold">Ticket Scanned Successfully</h3>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center text-gray-600 mt-4">
            <p>Point your camera at the QR code to scan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketScanner;
