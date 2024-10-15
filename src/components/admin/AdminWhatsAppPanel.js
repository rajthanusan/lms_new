import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QRCodeDisplay = () => {
  const [qrCode, setQrCode] = useState(null);
  
  // Function to fetch the QR code when the component mounts
  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/whatsapp/generate-qr');
        if (response.data.qr_code) {
          setQrCode(response.data.qr_code);
        } else {
          alert('QR code not available or already connected.');
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
        alert('Error fetching QR code.');
      }
    };

    fetchQRCode(); // Call the function to fetch QR code
  }, []); // Empty dependency array to run once on component mount

  return (
    <div>
      {qrCode ? (
        <div>
          <p>Scan this QR code with WhatsApp:</p>
          {/* Display the QR code image */}
          <img src={qrCode} alt="QR Code" style={{ width: '200px', height: '200px' }} />
        </div>
      ) : (
        <p>Loading QR Code...</p>
      )}
    </div>
  );
};

export default QRCodeDisplay;
