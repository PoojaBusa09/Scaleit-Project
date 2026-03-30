import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from '../../../components/PageHeader.tsx';
import {
    SaveIcon,
    PrinterIcon,
    InfoIcon
} from "../../../components/icons.tsx";
import { VisionSection } from "../types.ts";
import { InstructionsModal } from '../../../components/InstructionsModal.tsx';
// Removed DEFAULT_SECTIONS import as it is handled by the hook
import { ImageUploadButton } from "../../../components/ui/ImageUploadButton.tsx";
import { Modal } from "../../../components/ui/Modal.tsx";
import { useBigPictureVision } from "../hooks/useBigPictureVision.ts";

import {
    ChevronRightIcon as ChevronRightIconLocal
} from "../../../components/icons.tsx";


interface SectionRowProps {
    section: VisionSection;
    onClick: () => void;
    isExpanded: boolean;
    onImageUpload: (url: string) => void;
    onDateChange: (id: string, date: string) => void; // Added prop
}

/**
 * Renders a row for a specific vision section in the template view.
 */
const SectionRow: React.FC<SectionRowProps> = ({ section, onClick, isExpanded, onImageUpload, onDateChange }) => {
    // const Icon = section.icon; // Not used in row view
    const hasContent = section.content.trim().length > 0;
    // Removed local dateValue state, using section.date

    return (
        <div
            className={`${section.bgColor} ${section.borderColor} border rounded-lg mb-3 transition-all duration-200`}
        >
            <div className="flex items-stretch">
                {/* Image Upload Area - Using Shared Component */}
                <div className="w-32 flex-shrink-0 p-4 border-r border-gray-200/50 flex items-center justify-center">
                    <ImageUploadButton
                        imageUrl={section.imageUrl}
                        onUpload={onImageUpload}
                    />
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <button
                        onClick={onClick}
                        className="w-full flex items-center gap-4 p-4 text-left"
                        aria-expanded={isExpanded}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                                <h4 className="font-bold text-sm text-black">{section.title}</h4>
                                {section.hasDatePicker && (
                                    <input
                                        type="date"
                                        value={section.date || "2024-01-15"}
                                        onChange={(e) => onDateChange(section.id, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:border-primary focus:outline-none"
                                        aria-label={`Date for ${section.title}`}
                                    />
                                )}
                            </div>
                            {section.subtitle && (
                                <p className="text-xs text-gray-600 mt-0.5">{section.subtitle}</p>
                            )}
                            {hasContent && !isExpanded && (
                                <p className="text-xs text-gray-700 mt-2 line-clamp-2">{section.content}</p>
                            )}
                        </div>
                        <ChevronRightIconLocal
                            className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-90" : ""
                                }`}
                        />
                    </button>
                    {isExpanded && (
                        <div className="px-4 pb-4">
                            <p className="text-sm text-black leading-relaxed whitespace-pre-wrap">
                                {hasContent ? section.content : (
                                    <span className="text-gray-400 italic">Click to edit and add content...</span>
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface EditorModalProps {
    section: VisionSection | null;
    onClose: () => void;
    onSave: (id: string, content: string) => void;
}

/**
 * Modal for editing the content of a vision section.
 */
const EditorModal: React.FC<EditorModalProps> = ({ section, onClose, onSave }) => {
    const [content, setContent] = useState(section?.content || "");

    React.useEffect(() => {
        if (section) {
            setContent(section.content);
        }
    }, [section]);

    const handleSave = () => {
        if (section) {
            onSave(section.id, content);
            onClose();
        }
    };

    if (!section) return null;

    const charCount = content.length;
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    // Create custom footer for the Modal
    const modalFooter = (
        <React.Fragment>
            <button
                onClick={onClose}
                className="px-5 py-2.5 text-black hover:bg-gray-100 rounded-lg font-bold transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
                <SaveIcon className="w-4 h-4" />
                Save
            </button>
        </React.Fragment>
    );

    return (
        <Modal
            isOpen={!!section}
            onClose={onClose}
            title={section.title}
            size="lg"
            footer={modalFooter}
        >
            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100 bg-gray-50 -mx-6 px-6 pt-2" role="toolbar" aria-label="Text Formatting">
                <button className="px-3 py-1.5 text-sm font-bold text-black hover:bg-gray-200 rounded transition-colors" aria-label="Bold">
                    B
                </button>
                <button className="px-3 py-1.5 text-sm italic text-black hover:bg-gray-200 rounded transition-colors" aria-label="Italic">
                    I
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <button className="px-3 py-1.5 text-sm text-black hover:bg-gray-200 rounded transition-colors" aria-label="List">
                    • List
                </button>
                <button className="px-3 py-1.5 text-sm text-black hover:bg-gray-200 rounded transition-colors" aria-label="Numbered List">
                    1. Numbered
                </button>
                <div className="flex-1" />
                <span className="text-xs text-gray-500">
                    CHARS: {charCount} | WORDS: {wordCount}
                </span>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden min-h-[300px]">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Describe your vision for "${section.title}"...\n\nConsider:\n• What does success look like?\n• What are the key milestones?\n• How will you measure progress?`}
                    className="w-full h-full p-4 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none text-black"
                    style={{ lineHeight: "1.7" }}
                    aria-label="Section Content"
                />
            </div>
        </Modal>
    );
};

// Mind Map Card Component
interface MindMapCardProps {
    section: VisionSection;
    onClick: () => void;
}

const MindMapCard: React.FC<MindMapCardProps> = ({ section, onClick }) => {
    const Icon = section.icon;
    const hasContent = section.content.trim().length > 0;

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 border border-outline hover:border-primary/30 min-h-[140px] flex flex-col"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-bold text-xs text-black leading-tight line-clamp-2">
                    {section.title}
                </h4>
            </div>
            <div className="flex-1 overflow-hidden">
                {hasContent ? (
                    <p className="text-xs text-black/70 leading-relaxed line-clamp-4">
                        {section.content}
                    </p>
                ) : (
                    <p className="text-xs text-gray-400 italic">Click to add...</p>
                )}
            </div>
        </div>
    );
};



/**
 * Main Big Picture Vision page.
 * Displays a mind map and template for strategy visualization.
 */
const BigPictureVision: React.FC = () => {
    const {
        sections,
        activeSection,
        setActiveSection,
        expandedId,
        logoUrl,
        setLogoUrl,
        updateSectionContent,
        updateSectionImage,
        updateSectionDate,
        toggleSection
    } = useBigPictureVision();

    const [activeTab, setActiveTab] = useState<"mindmap" | "template">("mindmap");
    const [showInstructions, setShowInstructions] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto">
            {/* Instructions Modal */}
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Big Picture Vision Instructions"
            >
                <div className="space-y-6">
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Purpose</h3>
                        <p className="text-slate-600 leading-relaxed">
                            To create a visual representation of your business's future. By defining your vision across all key areas in present tense as if it's 3 years from now, you create a powerful magnetic pull toward your goals.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Directions</h3>
                        <ul className="list-disc pl-5 space-y-3 text-slate-600">
                            <li>
                                <strong>Mind Map (Pt 1):</strong> Brainstorm your vision for each of the key business areas. Click any card to edit.
                            </li>
                            <li>
                                <strong>Template (Pt 2):</strong> Organize your thoughts into the formal template. Upload your logo and high-impact images for each section to make it visual and inspiring.
                            </li>
                            <li>
                                <strong>Present Tense:</strong> Write all descriptions as if they are already reality 3 years from today.
                            </li>
                            <li>
                                <strong>Dates:</strong> Use the date pickers to set specific milestones for when these visions will be achieved.
                            </li>
                        </ul>
                    </section>
                </div>
            </InstructionsModal>

            {/* Header */}
            <PageHeader
                title="Big Picture Vision"
                description="Define and document your strategic vision across all key areas of your business."
                onBack={() => navigate('/scaleit-method')}
                backLabel="Back to SCALEit Method"
            >
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-accent/10 text-accent-content rounded-lg text-sm font-bold hover:bg-accent/20 transition-colors flex items-center gap-2"
                    >
                        <PrinterIcon className="w-4 h-4" />
                        Print
                    </button>
                    <button
                        onClick={() => setShowInstructions(true)}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white text-sm font-bold shadow-sm"
                    >
                        <InfoIcon className="w-4 h-4 text-blue-600" />
                        Instructions
                    </button>
                </div>
            </PageHeader>

            {/* Tabs Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-outline mb-6">
                <div className="flex items-center justify-between p-3">
                    <div className="flex gap-1 w-full">
                        <button
                            onClick={() => setActiveTab("mindmap")}
                            className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === "mindmap"
                                ? "bg-primary text-white shadow-md relative z-10"
                                : "text-black hover:bg-gray-50"
                                }`}
                        >
                            Pt 1 - Big Picture Vision Mind Map
                        </button>
                        <button
                            onClick={() => setActiveTab("template")}
                            className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === "template"
                                ? "bg-primary text-white shadow-md relative z-10"
                                : "text-black hover:bg-gray-50"
                                }`}
                        >
                            Pt 2 - Big Picture Vision Template
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === "mindmap" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {sections.map((section) => (
                        <MindMapCard
                            key={section.id}
                            section={section}
                            onClick={() => setActiveSection(section)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-outline">
                    {/* Template Header with Logo Upload */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-start gap-6">
                            {/* Logo Upload - Using Shared Component */}
                            <div className="flex-shrink-0">
                                <ImageUploadButton
                                    imageUrl={logoUrl}
                                    onUpload={setLogoUrl}
                                    label="Upload Your Logo"
                                />
                            </div>

                            {/* Title and Description */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-serif font-bold text-primary tracking-wide">
                                    BIG PICTURE VISION
                                </h2>
                                <p className="text-xs text-accent font-bold tracking-widest mt-1 mb-3">
                                    T E M P L A T E
                                </p>
                                <p className="text-sm text-black leading-relaxed">
                                    Brainstorm with your Big Picture Vision Mind Map, then use this template to organize your thoughts so you can create your final Big Picture Vision. (Write in present tense as if it is 3 years from now).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Template Sections */}
                    <div className="p-6 space-y-1">
                        {sections.map((section) => (
                            <SectionRow
                                key={section.id}
                                section={section}
                                onClick={() => toggleSection(section)}
                                isExpanded={expandedId === section.id}
                                onImageUpload={(url) => updateSectionImage(section.id, url)}
                                onDateChange={updateSectionDate}
                            />
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                        <p className="text-xs text-gray-500">
                            The Big Picture Vision Forms
                        </p>
                    </div>
                </div>
            )}

            {/* Editor Modal */}
            <EditorModal
                section={activeSection}
                onClose={() => setActiveSection(null)}
                onSave={updateSectionContent}
            />
        </div>
    );
};

export default BigPictureVision;
