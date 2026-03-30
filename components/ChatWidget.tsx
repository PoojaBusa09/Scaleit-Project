
import React, { useState, useRef, useEffect } from 'react';
// Fix: Corrected import path for icons
import { MessageCircleIcon, SparklesIcon, SendIcon } from './icons.tsx';
// Fix: Corrected import path for types
import { Message } from '../types.ts';
import { getAIAssistantResponse } from '../services/geminiService';

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
             setMessages([{ id: 'initial', text: "Hello! I'm Pinnacle AI. How can I help you grow your business today?", sender: 'bot' }]);
        }
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponseText = await getAIAssistantResponse(input);
            const botMessage: Message = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = { id: (Date.now() + 1).toString(), text: "Sorry, I couldn't get a response. Please try again.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 bg-primary text-on-primary h-14 w-14 rounded-2xl shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-label="Toggle chat widget"
            >
                <MessageCircleIcon className="h-6 w-6" />
            </button>
            {isOpen && (
                <div className="fixed bottom-24 right-8 w-96 h-[32rem] bg-surface rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out border border-outline/30">
                    <header className="bg-surface p-4 rounded-t-2xl flex items-center border-b border-outline/30">
                        <SparklesIcon className="h-6 w-6 mr-3 text-primary" />
                        <h3 className="font-semibold text-title-md text-on-surface">Pinnacle AI Assistant</h3>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-3 py-2 rounded-lg max-w-xs text-body-md ${msg.sender === 'user' ? 'bg-primary text-on-primary rounded-br-none' : 'bg-secondary-container text-on-secondary-container rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start my-2">
                                <div className="px-3 py-2 rounded-lg bg-secondary-container text-on-secondary-container rounded-bl-none">
                                    <span className="animate-pulse">...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-2 border-t border-outline/30">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask Pinnacle AI..."
                                className="w-full pl-4 pr-12 py-3 bg-surface-variant border-transparent focus:border-primary text-on-surface-variant placeholder-on-surface-variant rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled={isLoading}
                            />
                             <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-on-primary rounded-full hover:bg-primary/90 disabled:bg-on-surface/20">
                                <SendIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatWidget;