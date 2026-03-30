
import React, { useState } from "react";
import { Card } from "../../../components/ui/Card.tsx";
import { PageHeader } from '../../../components/PageHeader.tsx';
import { MOCK_TRANSACTIONS } from '../../../data/mockFinancials.ts';
import { mockDataService } from '../../../services/mockDataService.ts';
import { CheckCircleIcon, AlertTriangleIcon, RefreshCwIcon, DownloadIcon, ExternalLinkIcon, FileTextIcon, DollarSignIcon, CreditCardIcon, SettingsIcon, RotateCcwIcon } from '../../../components/icons.tsx';
import { Transaction } from '../../../types.ts';

const QBOIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleConnect = () => {
    // Simulate OAuth flow
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      "",
      "Connect to QuickBooks",
      `width = ${width}, height = ${height}, left = ${left}, top = ${top} `
    );

    if (popup) {
      popup.document.write(`
  < html >
                <head><title>QuickBooks Login</title></head>
                <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f4f5f7;">
                    <h2 style="color: #2ca01c;">QuickBooks Online</h2>
                    <p>Connecting ScaleIT to your QuickBooks account...</p>
                    <button onclick="window.opener.postMessage('qbo-connected', '*'); window.close();" style="padding: 10px 20px; background-color: #2ca01c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">Authorize</button>
                </body>
            </html >
  `);

      window.addEventListener("message", (event) => {
        if (event.data === "qbo-connected") {
          setIsConnected(true);
          setLastSync(new Date().toLocaleString());
        }
      });
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleString());
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          QuickBooks Integration
        </h1>
        <p className="text-gray-500 mt-2">
          Sync your billing data with QuickBooks Online
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div
              className={`w - 20 h - 20 rounded - full flex items - center justify - center ${isConnected ? "bg-green-100" : "bg-gray-100"
                } `}
            >
              {isConnected ? (
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              ) : (
                <SettingsIcon className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isConnected ? "Connected to QuickBooks" : "Not Connected"}
            </h2>
            <p className="text-center text-gray-500 max-w-sm">
              {isConnected
                ? `Your account is connected.Last sync was on ${lastSync}.`
                : "Connect your QuickBooks Online account to automatically sync invoices, payments, and customers."}
            </p>

            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="px-6 py-3 bg-[#2ca01c] text-white rounded-lg hover:bg-[#258e18] transition-colors font-medium flex items-center gap-2"
              >
                Connect to QuickBooks
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RotateCcwIcon
                    className={`h - 4 w - 4 ${isSyncing ? "animate-spin" : ""} `}
                  />
                  {isSyncing ? "Syncing..." : "Sync Now"}
                </button>
                <button
                  onClick={() => setIsConnected(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sync Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded border border-gray-200">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Invoices</p>
                  <p className="text-sm text-gray-500">
                    Sync created invoices to QBO
                  </p>
                </div>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle1"
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-400"
                  defaultChecked
                />
                <label
                  htmlFor="toggle1"
                  className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded border border-gray-200">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Customers</p>
                  <p className="text-sm text-gray-500">
                    Sync member details to QBO
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-indigo-600 rounded"
                defaultChecked
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded border border-gray-200">
                  <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Payments</p>
                  <p className="text-sm text-gray-500">
                    Sync payment records (Manual)
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-indigo-600 rounded"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QBOIntegration;
