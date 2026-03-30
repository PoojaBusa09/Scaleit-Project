import React from 'react';
import OrgChartBuilder from './OrgChartBuilderPage.tsx';

const MySuccessTeamPage: React.FC = () => {
    const instructions = (
        <div className="space-y-6 text-slate-700">
            <div>
                <h3 className="text-xl font-bold mb-2">Purpose</h3>
                <p>To be thoughtful and deliberate with your Hiring Planning. Remember, hire slowly, fire fast.</p>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-2">Directions</h3>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>Fill in your <em>My Success Team Tool</em> for your current team positions and your intended hires in the next 12 months. Get clear on the areas of your company that you are either out of bandwidth, or want to expand and grow.</li>
                    <li>The top squares can be for the CEO, Founder, Partner, COB (Chairman of the Board).</li>
                    <li>The next tier is for leadership positions followed by their team.</li>
                    <li>Use the <em>Hire for Growth</em> Tool to determine benchmarks and metrics per position so that each hire pays for itself and fuels your company’s growth.</li>
                    <li>For leadership positions, use the <em>4 Superpowers Tool</em> to determine which hires are needed next.</li>
                </ol>
            </div>
        </div>
    );

    return (
        <OrgChartBuilder
            title="My Success Team"
            storageKey="scaleit_my_success_team"
            backLabel="Back to SCALEit Method"
            backPath="/scaleit-method"
            instructions={instructions}
        />
    );
};

export default MySuccessTeamPage;
