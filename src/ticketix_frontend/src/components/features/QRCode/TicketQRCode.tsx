import React from "react";
import QRCode from "react-qr-code";

interface TicketQRCodeProps {
  ticketId: string;
  eventId: string;
  owner: string;
}

const TicketQRCode: React.FC<TicketQRCodeProps> = ({
  ticketId,
  eventId,
  owner,
}) => {
  const qrValue = JSON.stringify({ ticketId, eventId, owner });

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Scan Your Ticket</h2>
      <QRCode value={qrValue} size={200} />
      <p className="text-gray-600 text-center">
        Show this QR code at the entrance.
      </p>
    </div>
  );
};

export default TicketQRCode;
