import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStrategicVision } from '../useStrategicVision';

describe('useStrategicVision', () => {
    it('initializes with default values', () => {
        const { result } = renderHook(() => useStrategicVision());
        expect(result.current.isEditing).toBe(false);
        expect(result.current.streams).toEqual([]);
        expect(result.current.totalProjectedRevenue).toBe(0);
        expect(result.current.gapToGoal).toBe(0);
    });

    it('adds revenue stream and updates calculations', () => {
        const { result } = renderHook(() => useStrategicVision());

        act(() => {
            result.current.addStream({ name: 'Product A', price: 100, salesCount: 5 });
        });

        expect(result.current.streams).toHaveLength(1);
        expect(result.current.streams[0].name).toBe('Product A');
        expect(result.current.totalProjectedRevenue).toBe(500); // 100 * 5
    });

    it('calculates percent of goal and gap correctly', () => {
        const { result } = renderHook(() => useStrategicVision());

        act(() => {
            result.current.setRevenueGoal(1000);
            result.current.addStream({ name: 'Product A', price: 100, salesCount: 5 }); // 500 total
        });

        expect(result.current.totalProjectedRevenue).toBe(500);
        expect(result.current.gapToGoal).toBe(500); // 1000 - 500
        expect(result.current.percentOfGoal).toBe(50); // 500/1000
    });

    it('deletes revenue stream updates totals', () => {
        const { result } = renderHook(() => useStrategicVision());

        act(() => {
            result.current.addStream({ name: 'Product A', price: 100, salesCount: 5 });
        });

        const streamId = result.current.streams[0].id;

        act(() => {
            result.current.deleteStream(streamId);
        });

        expect(result.current.streams).toHaveLength(0);
        expect(result.current.totalProjectedRevenue).toBe(0);
    });
});
