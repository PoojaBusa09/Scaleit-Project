import React from "react";

const MentorsCornerPage: React.FC = () => {
    return (
        <div style={{ padding: "32px 40px", maxWidth: 800 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0C2340", marginBottom: 8 }}>
                Mentor's Corner
            </h1>
            <p style={{ color: "#64748b", fontSize: 15, marginBottom: 32 }}>
                Access mentor resources, training materials, and community updates.
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
                <span style={{ fontSize: 48, marginBottom: 16 }}>🎓</span>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0C2340", marginBottom: 8 }}>
                    Coming Soon
                </h2>
                <p style={{ color: "#94a3b8", fontSize: 14, maxWidth: 400 }}>
                    This will link directly to the Mentor's Corner microsite with training resources, best practices, and mentor community content.
                </p>
            </div>
        </div>
    );
};

export default MentorsCornerPage;
