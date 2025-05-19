import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Navbar from "./Navbar";
import Footer from "./Footer";

const QRScanner = () => {
  const qrRegionId = "qr-reader";
  const html5QrCodeRef = useRef(null);
  const [scanned, setScanned] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [lastData, setLastData] = useState("");
  const [entryType, setEntryType] = useState("IN");
  const [gateNo, setGateNo] = useState("00");
  const srNumberRef = useRef(1);
  const [userIp, setUserIp] = useState("");
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [isLocationReady, setIsLocationReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user IP address
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        setUserIp(ipData.ip);

        // Get user's location coordinates
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              setIsLocationReady(true);
            },
            (error) => console.error("Geolocation error:", error.message)
          );
        } else {
          setIsLocationReady(true);
        }
      } catch (error) {
        console.error("Error fetching IP or location:", error);
        setIsLocationReady(true);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
    let isMounted = true;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!isMounted || !isLocationReady) return;
        if (devices.length) {
          const cameraId = devices[devices.length - 1].id;
          const config = { fps: 10, qrbox: 250 };

          setTimeout(() => {
            const element = document.getElementById(qrRegionId);
            if (element) {
              html5QrCodeRef.current
                .start(
                  cameraId,
                  config,
                  (text) => {
                    if (text !== lastData) {
                      const now = new Date();
                      const timestamp = `${String(now.getDate()).padStart(2, "0")}-${now.toLocaleString("en", { month: "short" })}-${String(now.getFullYear()).slice(-2)} ${now.toLocaleTimeString("en-GB")}`;

                      setScanned((prev) => [
                        ...prev,
                        {
                          srNumber: srNumberRef.current++,
                          gateNo,
                          data: text,
                          timestamp,
                          entryType,
                          ip: userIp,
                          latitude: location.latitude,
                          longitude: location.longitude,
                        },
                      ]);
                      setLastData(text);
                      setShowPopup(true);
                    }
                  },
                  (err) => {
                    console.warn("QR error:", err);
                  }
                )
                .catch((err) => {
                  console.error("Start error:", err);
                });
            }
          }, 300);
        }
      })
      .catch((err) => console.error("Camera access error:", err));

    return () => {
      isMounted = false;
      if (
        html5QrCodeRef.current &&
        html5QrCodeRef.current.getState() === Html5QrcodeScannerState.SCANNING
      ) {
        html5QrCodeRef.current
          .stop()
          .then(() => html5QrCodeRef.current.clear())
          .catch((err) => console.warn("Stop error (likely safe):", err));
      }
    };
  }, [lastData, isLocationReady]);

  const downloadCSV = () => {
    const csv = Papa.unparse(scanned);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "qr_scans_with_location.csv");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex flex-col items-center p-6 bg-gray-100 overflow-auto">
        <h2 className="text-xl font-bold mb-4">QR Code Scanner</h2>

        {/* Gate Number Selection */}
        <div className="mb-4">
          <label className="text-lg font-semibold mr-2">Select Gate Number:</label>
          <select value={gateNo} onChange={(e) => setGateNo(e.target.value)} className="p-2 border rounded">
            {[...Array(100).keys()].map((num) => (
              <option key={num} value={String(num).padStart(2, "0")}>
                {String(num).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        {/* Entry Type Selection */}
        <div className="mb-4">
          <label className="text-lg font-semibold mr-2">Select Entry Type:</label>
          <select value={entryType} onChange={(e) => setEntryType(e.target.value)} className="p-2 border rounded">
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>
        </div>

        <div id={qrRegionId} className="w-full max-w-sm bg-white p-4 rounded shadow" />

        {showPopup && (
          <div className="relative mt-4 bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">✅ Scan Successful</h3>
            <p>Sr. Number: {srNumberRef.current - 1}</p>
            <p>Gate No: {gateNo}</p>
            <p>Data: {lastData}</p>
            <p>Time: {scanned.at(-1)?.timestamp}</p>
            <p>Entry Type: {entryType}</p>
            <p>IP Address: {scanned.at(-1)?.ip}</p>
            <p>Latitude: {scanned.at(-1)?.latitude}</p>
            <p>Longitude: {scanned.at(-1)?.longitude}</p>
            <div className="mt-2 space-x-2 flex flex-col sm:flex-row">
              <button onClick={downloadCSV} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Download CSV
              </button>
              <button onClick={() => setShowPopup(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default QRScanner;