import { PageHeader } from '../../../components/PageHeader.tsx';
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_FINANCIAL_DATA } from '../../../constants.ts';
import { FinancialData, Scenario } from '../../../types.ts';
import { ChevronLeftIcon, DollarSignIcon, BarChartIcon, InfoIcon } from '../../../components/icons.tsx';
import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

/**
 * Formats a number as USD currency.
 */
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

interface InputFieldProps {
    label: string;
    name: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Reusable input field for financial data.
 */
const InputField = ({ label, name, value, onChange }: InputFieldProps) => (
    <div>
        <label htmlFor={name} className="block text-body-md font-medium text-on-surface-variant mb-1">{label}</label>
        <input
            id={name}
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-3 bg-surface border border-outline rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            aria-label={label}
        />
    </div>
);

interface SliderProps {
    label: string;
    name: string;
    value: number;
    min: string;
    max: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Reusable slider component for scenario adjustment.
 */
const Slider = ({ label, name, value, min, max, onChange }: SliderProps) => (
    <div>
        <label htmlFor={name} className="text-body-md font-medium text-on-surface-variant">{label}: <span className="font-bold text-primary">{value}%</span></label>
        <input
            id={name}
            type="range"
            name={name}
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            className="w-full mt-1 h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer"
            aria-valuemin={Number(min)}
            aria-valuemax={Number(max)}
            aria-valuenow={value}
            aria-label={label}
        />
    </div>
);

/**
 * Financial Forecasting Page.
 * Allows users to model financial futures based on baseline data and growth scenarios.
 */
const FinancialForecasting: React.FC = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [baseData, setBaseData] = useState<FinancialData>(MOCK_FINANCIAL_DATA);
    const [scenario, setScenario] = useState<Scenario>({
        revenueGrowth: 10,
        cogsPercentage: 30,
        opexGrowth: 5,
    });

    const forecast = useMemo(() => {
        const quarters = [];
        let lastRevenue = baseData.revenue / 4; // Start with a quarterly baseline
        let lastOpex = baseData.opex / 4;

        for (let i = 1; i <= 4; i++) {
            const revenue = lastRevenue * (1 + scenario.revenueGrowth / 100);
            const cogs = revenue * (scenario.cogsPercentage / 100);
            const grossProfit = revenue - cogs;
            const opex = lastOpex * (1 + scenario.opexGrowth / 100);
            const netProfit = grossProfit - opex;

            quarters.push({
                quarter: `Q${i}`,
                revenue,
                cogs,
                grossProfit,
                opex,
                netProfit,
            });

            lastRevenue = revenue;
            lastOpex = opex;
        }
        return quarters;
    }, [baseData, scenario]);

    const maxForecastValue = Math.max(...forecast.map(q => q.revenue), 1); // Avoid division by zero

    const handleBaseDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBaseData(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
    };

    const handleScenarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScenario(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
    };

    const navigate = useNavigate();

    return (
        <div className="animate-fade-in">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Financial Forecasting Instructions"
            >
                <div className="space-y-4 text-slate-600">
                    <p>
                        This tool allows you to model your business's financial future by adjusting key growth and expense variables.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Baseline Annual Data:</strong> Enter your current annual Revenue, COGS, and OpEx.</li>
                        <li><strong>Scenario Sliders:</strong> Adjust quarterly growth targets to see the projected impact on Net Profit.</li>
                        <li><strong>Next 4 Quarters:</strong> Review the bar chart and table to visualize your business's potential trajectory.</li>
                    </ul>
                    <p>
                        Use this to test "What If" scenarios (e.g., "What if we increase revenue by 20% but OpEx also grows by 10%?") before making major decisions.
                    </p>
                </div>
            </InstructionsModal>

            <PageHeader
                title="Financial Forecasting Tool (PinnSight)"
                description="Model your financial future and test different scenarios."
                onBack={() => navigate('/scaleit-method')}
                backLabel="Back to SCALEit Method"
            >
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowInstructions(true)}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white text-sm font-bold shadow-sm"
                    >
                        <InfoIcon className="w-4 h-4 text-blue-600" />
                        Instructions
                    </button>
                    <button disabled className="bg-surface-variant text-on-surface-variant px-4 py-2 rounded-full text-label-lg font-medium cursor-not-allowed border border-transparent" aria-disabled="true">Sync with QuickBooks</button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                {/* Inputs & Scenarios */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-4 rounded-lg border border-outline/30">
                        <h3 className="font-medium text-title-md text-on-surface flex items-center mb-3"><DollarSignIcon className="h-5 w-5 mr-2" />Baseline Annual Data</h3>
                        <div className="space-y-4">
                            <InputField label="Total Revenue" name="revenue" value={baseData.revenue} onChange={handleBaseDataChange} />
                            <InputField label="Cost of Goods Sold (COGS)" name="cogs" value={baseData.cogs} onChange={handleBaseDataChange} />
                            <InputField label="Operating Expenses (OpEx)" name="opex" value={baseData.opex} onChange={handleBaseDataChange} />
                        </div>
                    </div>
                    <div className="p-4 rounded-lg border border-outline/30">
                        <h3 className="font-medium text-title-md text-on-surface mb-3">'What-If' Scenario Sliders</h3>
                        <div className="space-y-4">
                            <Slider label="Revenue Growth / Quarter" name="revenueGrowth" min="0" max="50" value={scenario.revenueGrowth} onChange={handleScenarioChange} />
                            <Slider label="COGS as % of Revenue" name="cogsPercentage" min="10" max="80" value={scenario.cogsPercentage} onChange={handleScenarioChange} />
                            <Slider label="OpEx Growth / Quarter" name="opexGrowth" min="0" max="25" value={scenario.opexGrowth} onChange={handleScenarioChange} />
                        </div>
                    </div>
                </div>

                {/* Forecast Visualization */}
                <div className="lg:col-span-2">
                    <h3 className="font-medium text-title-md text-on-surface flex items-center mb-3"><BarChartIcon className="h-5 w-5 mr-2" />Next 4 Quarters Forecast</h3>
                    <div className="bg-surface-variant/50 p-4 rounded-lg" role="img" aria-label="Forecast Bar Chart">
                        <div className="flex justify-around items-end h-64 border-b-2 border-outline/50">
                            {forecast.map((q, i) => (
                                <div key={q.quarter} className="flex flex-col items-center w-1/4">
                                    <div className="relative w-10/12 h-full flex flex-col-reverse" title={`Revenue: ${formatCurrency(q.revenue)}`}>
                                        <div className="bg-tertiary transform-origin-bottom animate-grow-up" style={{ height: `${(q.netProfit / maxForecastValue) * 100}%`, animationDelay: `${i * 100 + 200}ms` }} title={`Net Profit: ${formatCurrency(q.netProfit)}`}></div>
                                        <div className="bg-primary transform-origin-bottom animate-grow-up" style={{ height: `${((q.grossProfit - q.netProfit) / maxForecastValue) * 100}%`, animationDelay: `${i * 100 + 100}ms` }} title={`OpEx: ${formatCurrency(q.grossProfit - q.netProfit)}`}></div>
                                        <div className="bg-secondary transform-origin-bottom animate-grow-up" style={{ height: `${(q.cogs / maxForecastValue) * 100}%`, animationDelay: `${i * 100}ms` }} title={`COGS: ${formatCurrency(q.cogs)}`}></div>
                                    </div>
                                    <p className="text-body-md font-medium mt-2">{q.quarter}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center space-x-4 mt-2 text-label-md">
                            <span className="flex items-center"><span className="w-3 h-3 bg-tertiary mr-1.5 rounded-sm"></span>Net Profit</span>
                            <span className="flex items-center"><span className="w-3 h-3 bg-primary mr-1.5 rounded-sm"></span>OpEx</span>
                            <span className="flex items-center"><span className="w-3 h-3 bg-secondary mr-1.5 rounded-sm"></span>COGS</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full text-sm">
                            <caption className="sr-only">Forecast Data Table</caption>
                            <thead>
                                <tr className="border-b border-outline">
                                    <th className="p-2 text-left font-medium text-on-surface-variant">Metric</th>
                                    {forecast.map(q => <th key={q.quarter} className="p-2 text-right font-medium text-on-surface-variant">{q.quarter}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-surface-variant"><td className="p-2 text-on-surface">Revenue</td>{forecast.map(q => <td key={q.quarter} className="p-2 text-right text-on-surface-variant">{formatCurrency(q.revenue)}</td>)}</tr>
                                <tr className="border-b border-surface-variant"><td className="p-2 text-on-surface">Gross Profit</td>{forecast.map(q => <td key={q.quarter} className="p-2 text-right text-on-surface-variant">{formatCurrency(q.grossProfit)}</td>)}</tr>
                                <tr className="border-b border-surface-variant font-semibold bg-tertiary-container/30"><td className="p-2 text-on-tertiary-container">Net Profit</td>{forecast.map(q => <td key={q.quarter} className="p-2 text-right text-on-tertiary-container">{formatCurrency(q.netProfit)}</td>)}</tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialForecasting;