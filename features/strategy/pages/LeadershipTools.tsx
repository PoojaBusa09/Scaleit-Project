
import React from 'react';
import { ScaleItToolsPage } from './ScaleItToolsPage';
// Fix: Corrected import path for types
import { ScaleITCategory } from '../../../types.ts';

interface LeadershipToolsProps {
  activeTab?: ScaleITCategory;
}

export const LeadershipTools: React.FC<LeadershipToolsProps> = ({ activeTab = 'L' }) => {
  return <ScaleItToolsPage activeTab={activeTab} />;
};