
import React, { useState } from 'react';
import { MOCK_SUPPORT_TICKETS } from '../../../constants.ts';
import { SupportTicket, TicketStatus, TicketCategory } from '../../../types.ts';
import { TicketIcon } from '../../../components/icons.tsx';

const SupportTickets: React.FC = () => {
    const [tickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Closed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
                <h2 className="text-headline-sm text-on-surface">My Support Tickets</h2>
                <p className="text-body-md text-on-surface-variant mt-1 mb-6">Track the status of your support requests here.</p>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-outline">
                                <th className="px-6 py-3 text-left text-label-lg text-on-surface-variant">Ticket ID</th>
                                <th className="px-6 py-3 text-left text-label-lg text-on-surface-variant">Subject</th>
                                <th className="px-6 py-3 text-left text-label-lg text-on-surface-variant">Category</th>
                                <th className="px-6 py-3 text-left text-label-lg text-on-surface-variant">Status</th>
                                <th className="px-6 py-3 text-left text-label-lg text-on-surface-variant">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket.id} className="border-b border-surface-variant hover:bg-surface-variant/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-primary">{ticket.id}</td>
                                    <td className="px-6 py-4 font-medium text-on-surface">{ticket.subject}</td>
                                    <td className="px-6 py-4 text-on-surface-variant">{ticket.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-on-surface-variant">{ticket.lastUpdated}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
                <h3 className="text-title-lg font-medium text-on-surface flex items-center mb-4">
                    <TicketIcon className="h-5 w-5 mr-3" />
                    Create New Ticket
                </h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant">Category</label>
                        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-outline focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-surface">
                            <option>Billing</option>
                            <option>Technical Support</option>
                            <option>Mentor Support</option>
                            <option>Admin Support</option>
                            <option>General Inquiry</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant">Subject</label>
                        <input type="text" className="mt-1 p-2 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border border-outline rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant">Description</label>
                        <textarea rows={5} className="mt-1 p-2 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border border-outline rounded-md" />
                    </div>
                    <button type="submit" className="w-full bg-primary text-on-primary py-2.5 rounded-full hover:shadow-lg text-label-lg font-medium transition-transform transform hover:scale-[1.02]">Submit Ticket</button>
                </form>
            </div>
        </div>
    );
};

export default SupportTickets;
