import React from "react";
import { mockDataService } from "../../../services/mockDataService";
import { OrgNode } from "../../../types";

const OrgNodeCard: React.FC<{ node: OrgNode; isRoot?: boolean }> = ({
  node,
  isRoot = false,
}) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div
        className={`
                    relative bg-white rounded-xl shadow-md border-2 p-4 min-w-[180px] text-center
                    transition-all hover:shadow-lg hover:-translate-y-1
                    ${isRoot
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-200"
          }
                `}
      >
        <div className="font-semibold text-gray-900">{node.name}</div>
        <div
          className={`text-sm ${isRoot ? "text-indigo-600" : "text-gray-500"}`}
        >
          {node.title}
        </div>
      </div>

      {/* Connector and Children */}
      {hasChildren && (
        <>
          {/* Vertical line down from parent */}
          <div className="w-0.5 h-6 bg-gray-300"></div>

          {/* Horizontal line connecting children */}
          <div className="relative flex items-start">
            {node.children!.length > 1 && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-gray-300"
                style={{
                  width: `calc(100% - 180px)`,
                }}
              ></div>
            )}

            {/* Children nodes */}
            <div className="flex gap-8">
              {node.children!.map((child: OrgNode) => (
                <div key={child.id} className="flex flex-col items-center">
                  {/* Vertical line up to horizontal connector */}
                  <div className="w-0.5 h-6 bg-gray-300"></div>
                  <OrgNodeCard node={child} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const TeamOrgChart: React.FC = () => {
  const orgChart = mockDataService.getOrgChart();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 overflow-x-auto">
        <div className="min-w-max flex justify-center py-8">
          <OrgNodeCard node={orgChart} isRoot />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">
          💡 Tip: You can edit your organization structure in the{" "}
          <a
            href="/tools/org-chart"
            className="text-indigo-600 hover:underline font-medium"
          >
            Org Chart Builder
          </a>
        </p>
      </div>
    </div>
  );
};

export default TeamOrgChart;
