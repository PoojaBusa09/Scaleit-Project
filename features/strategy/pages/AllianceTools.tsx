
import React from 'react';
import { ScaleItToolsPage } from './ScaleItToolsPage';
// Fix: Corrected import path for types
import { ScaleITCategory } from '../../../types.ts';

interface AllianceToolsProps {
  activeTab?: ScaleITCategory;
}

export const AllianceTools: React.FC<AllianceToolsProps> = ({ activeTab = 'A' }) => {
  return <ScaleItToolsPage activeTab={activeTab} />;
};