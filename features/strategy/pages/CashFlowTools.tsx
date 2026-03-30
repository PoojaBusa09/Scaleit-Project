
import React from 'react';
import { ScaleItToolsPage } from './ScaleItToolsPage';
// Fix: Corrected import path for types
import { ScaleITCategory } from '../../../types.ts';

interface CashFlowToolsProps {
  activeTab?: ScaleITCategory;
}

export const CashFlowTools: React.FC<CashFlowToolsProps> = ({ activeTab = 'C' }) => {
  return <ScaleItToolsPage activeTab={activeTab} />;
};