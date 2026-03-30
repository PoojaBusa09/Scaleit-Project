import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBigPictureVision } from '../useBigPictureVision';
import { DEFAULT_SECTIONS } from '../../constants';

describe('useBigPictureVision', () => {
    it('initializes with default sections', () => {
        const { result } = renderHook(() => useBigPictureVision());
        expect(result.current.sections).toEqual(DEFAULT_SECTIONS);
        expect(result.current.activeSection).toBeNull();
        expect(result.current.logoUrl).toBe("");
    });

    it('updates section content', () => {
        const { result } = renderHook(() => useBigPictureVision());
        const sectionId = DEFAULT_SECTIONS[0].id;
        const newContent = "New content for testing";

        act(() => {
            result.current.updateSectionContent(sectionId, newContent);
        });

        const updatedSection = result.current.sections.find(s => s.id === sectionId);
        expect(updatedSection?.content).toBe(newContent);
    });

    it('updates section date', () => {
        const { result } = renderHook(() => useBigPictureVision());
        const sectionId = DEFAULT_SECTIONS[0].id; // "who-we-are" has date picker
        const newDate = "2025-12-31";

        act(() => {
            result.current.updateSectionDate(sectionId, newDate);
        });

        const updatedSection = result.current.sections.find(s => s.id === sectionId);
        expect(updatedSection?.date).toBe(newDate);
    });

    it('toggles section expansion', () => {
        const { result } = renderHook(() => useBigPictureVision());
        const section = DEFAULT_SECTIONS[0];

        // First click - expand
        act(() => {
            result.current.toggleSection(section);
        });
        expect(result.current.expandedId).toBe(section.id);
        expect(result.current.activeSection).toBeNull();

        // Second click on same section - set active (edit mode)
        act(() => {
            result.current.toggleSection(section);
        });
        expect(result.current.activeSection).toEqual(section);
    });
});
