
import React from 'react';
import { ScaleItToolsPage } from './ScaleItToolsPage';
// Fix: Corrected import path for types
import { ScaleITCategory } from '../../../types.ts';

interface ExecutionToolsProps {
  activeTab?: ScaleITCategory;
}

export const ExecutionTools: React.FC<ExecutionToolsProps> = ({ activeTab = 'E' }) => {
  return <ScaleItToolsPage activeTab={activeTab} />;
};