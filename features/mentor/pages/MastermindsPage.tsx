import React from "react";

const MastermindsPage: React.FC = () => {
    return (
        <div style={{ padding: "32px 40px", maxWidth: 800 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0C2340", marginBottom: 8 }}>
                Masterminds
            </h1>
            <p style={{ color: "#64748b", fontSize: 15, marginBottom: 32 }}>
                View and manage your assigned mastermind groups.
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
                <span style={{ fontSize: 48, marginBottom: 16 }}>👥</span>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0C2340", marginBottom: 8 }}>
                    Coming Soon
                </h2>
                <p style={{ color: "#94a3b8", fontSize: 14, maxWidth: 400 }}>
                    Mastermind group management will be available here. You'll be able to view your assigned groups, schedule sessions, and track group progress.
                </p>
            </div>
        </div>
    );
};

export default MastermindsPage;
