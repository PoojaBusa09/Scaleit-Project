import { useState } from "react";
import { VisionSection } from "../types";
import { DEFAULT_SECTIONS } from "../constants";

export const useBigPictureVision = () => {
    const [sections, setSections] = useState<VisionSection[]>(DEFAULT_SECTIONS);
    const [activeSection, setActiveSection] = useState<VisionSection | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState<string>("");

    const updateSectionContent = (id: string, content: string) => {
        setSections((prev) =>
            prev.map((sec) => (sec.id === id ? { ...sec, content } : sec))
        );
    };

    const updateSectionImage = (id: string, url: string) => {
        setSections((prev) =>
            prev.map((sec) => (sec.id === id ? { ...sec, imageUrl: url } : sec))
        );
    };

    const updateSectionDate = (id: string, date: string) => {
        setSections((prev) =>
            prev.map((sec) => (sec.id === id ? { ...sec, date } : sec))
        );
    };

    const toggleSection = (section: VisionSection) => {
        if (expandedId === section.id) {
            setActiveSection(section);
        } else {
            setExpandedId(section.id);
        }
    };

    return {
        sections,
        activeSection,
        setActiveSection,
        expandedId,
        setExpandedId,
        logoUrl,
        setLogoUrl,
        updateSectionContent,
        updateSectionImage,
        updateSectionDate,
        toggleSection
    };
};
