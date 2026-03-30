import React from "react";

const WhatsAppPage: React.FC = () => {
    return (
        <div style={{ padding: "32px 40px", maxWidth: 800 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0C2340", marginBottom: 8 }}>
                WhatsApp
            </h1>
            <p style={{ color: "#64748b", fontSize: 15, marginBottom: 32 }}>
                Quick access to WhatsApp communication channels.
            </p>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "64px 32px",
                    borderRadius: 14,
                    border: "1px dashed #cbd5e1",
                    background: "#f8fafc",
                    textAlign: "center",
                }}
            >
                <span style={{ fontSize: 48, marginBottom: 16 }}>💬</span>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0C2340", marginBottom: 8 }}>
                    Coming Soon
                </h2>
                <p style={{ color: "#94a3b8", fontSize: 14, maxWidth: 400 }}>
                    WhatsApp integration for mentor communication will be configured here. Stay tuned for details on how this will work.
                </p>
            </div>
        </div>
    );
};

export default WhatsAppPage;
