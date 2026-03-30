import React, { useRef } from "react";
import { UploadIcon } from "lucide-react"; // Using lucide-react direct import if simpler, or local icons if preferred. 
// However, the original file used a local SVG definition for UploadIcon. 
// I will replicate the local definition or use the project's icon strategy.
// Checking icons.tsx in previous file list... `icons.tsx` exists.
// I'll check if UploadIcon is in icons.tsx or if I should define it here.
// The code in BigPictureVisionPage defined it locally. I will move it to the component or import if available.
// For now, I'll include the SVG locally to ensure self-containment, but ideally it goes to icons.tsx.

interface ImageUploadProps {
    imageUrl?: string;
    onUpload: (url: string) => void;
    label?: string;
    className?: string; // Additional prop for flexibility
}

const UploadIconSvg: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

/**
 * Component for uploading and displaying an image.
 * Extracted from BigPictureVisionPage.tsx
 */
export const ImageUploadButton: React.FC<ImageUploadProps> = ({
    imageUrl,
    onUpload,
    label = "Upload Picture",
    className = ""
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpload(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            {imageUrl ? (
                <div className="relative group">
                    <img
                        src={imageUrl}
                        alt="Uploaded"
                        className="w-20 h-20 object-cover rounded-lg border border-outline"
                    />
                    <button
                        onClick={handleClick}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                        aria-label="Change image"
                    >
                        <UploadIconSvg className="w-6 h-6 text-white" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleClick}
                    className="w-20 h-20 border-2 border-dashed border-primary/40 rounded-lg flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors"
                    aria-label={label}
                >
                    <UploadIconSvg className="w-6 h-6 text-primary/60" />
                </button>
            )}
            <span className="text-xs text-primary font-medium mt-2">{label}</span>
        </div>
    );
};
