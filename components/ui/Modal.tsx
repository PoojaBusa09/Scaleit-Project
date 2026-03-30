import React, { useEffect, useRef } from "react";
import { XIcon } from "../icons";

interface ModalProps {
  /** Controls visibility of the modal. */
  isOpen: boolean;
  /** Callback fired when the modal requests (e.g., background click, ESC key). */
  onClose: () => void;
  /** Text displayed in the header. */
  title: string;
  /** Main content area. */
  children: React.ReactNode;
  /** Optional footer content (e.g., action buttons). */
  footer?: React.ReactNode;
  /** Width size variant. Defaults to 'md'. */
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Reusable Modal component with backdrop, animation, and focus management.
 * 
 * @example
 * <Modal isOpen={isOpen} onClose={close} title="Edit Item">
 *   <Form />
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div
        ref={modalRef}
        className={`bg-surface rounded-xl shadow-2xl w-full ${sizeClasses[size]} flex flex-col max-h-[90vh] animate-fade-in-up-fast`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-outline/10">
          <h3 className="text-title-lg font-bold text-on-surface">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>

        {footer && (
          <div className="p-6 border-t border-outline/10 bg-surface-variant/5 rounded-b-xl flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
