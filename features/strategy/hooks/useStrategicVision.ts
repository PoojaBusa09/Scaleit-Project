import { useState, useMemo } from 'react';
import { RevenueStream } from '../types';

export const useStrategicVision = () => {
    // View State
    const [isEditing, setIsEditing] = useState(false);

    // Financial Snapshot State
    const [lastYearRevenue, setLastYearRevenue] = useState<number>(() => {
        const stored = localStorage.getItem('sv_lastYearRevenue');
        return stored ? Number(stored) : 0;
    });
    const [revenueGoal, setRevenueGoal] = useState<number>(() => {
        const stored = localStorage.getItem('sv_revenueGoal');
        return stored ? Number(stored) : 0;
    });

    // Revenue Streams State
    const [streams, setStreams] = useState<RevenueStream[]>(() => {
        const stored = localStorage.getItem('sv_streams');
        try {
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    });

    // Persistence Effects
    useMemo(() => { // Using useMemo/useEffect to save when changed
        localStorage.setItem('sv_lastYearRevenue', lastYearRevenue.toString());
    }, [lastYearRevenue]);

    useMemo(() => {
        localStorage.setItem('sv_revenueGoal', revenueGoal.toString());
    }, [revenueGoal]);

    useMemo(() => {
        localStorage.setItem('sv_streams', JSON.stringify(streams));
    }, [streams]);

    // Derived Financials
    const totalProjectedRevenue = useMemo(() =>
        streams.reduce((sum, stream) => sum + (stream.price * stream.salesCount), 0),
        [streams]
    );

    const totalProjectedCustomers = useMemo(() =>
        streams.reduce((sum, stream) => sum + stream.salesCount, 0),
        [streams]
    );

    const percentOfGoal = useMemo(() =>
        revenueGoal > 0 ? (totalProjectedRevenue / revenueGoal) * 100 : 0,
        [revenueGoal, totalProjectedRevenue]
    );

    const gapToGoal = useMemo(() =>
        revenueGoal - totalProjectedRevenue,
        [revenueGoal, totalProjectedRevenue]
    );

    /**
     * Adds a new revenue stream to the list.
     */
    const addStream = (stream: Omit<RevenueStream, 'id'>) => {
        const newStream: RevenueStream = {
            ...stream,
            id: Date.now().toString()
        };
        setStreams([...streams, newStream]);
    };

    /**
     * Deletes a revenue stream by ID.
     */
    const deleteStream = (id: string) => {
        setStreams(streams.filter(s => s.id !== id));
    };

    /**
     * Handles saving the strategic plan.
     * Currently mocks a save action.
     */
    const savePlan = () => {
        console.log("Saving Strategic Plan...", { lastYearRevenue, revenueGoal, streams });
        // TODO: Integrate with backend service
        setIsEditing(false);
    };

    return {
        isEditing,
        setIsEditing,
        lastYearRevenue,
        setLastYearRevenue,
        revenueGoal,
        setRevenueGoal,
        streams,
        totalProjectedRevenue,
        totalProjectedCustomers,
        percentOfGoal,
        gapToGoal,
        addStream,
        deleteStream,
        savePlan
    };
};
