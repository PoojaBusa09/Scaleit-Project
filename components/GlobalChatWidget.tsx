import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, SendIcon, XIcon, MessageSquareIcon } from './icons.tsx';
import { Message } from '../features/communication/types';
import { getAIAssistantResponse } from '../services/geminiService';

const GlobalChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'initial', text: "Hello! I'm Pinnacle AI. How can I assist you?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const handleOpenAI = () => setIsOpen(true);
        window.addEventListener('open-pinnacle-ai', handleOpenAI);
        return () => window.removeEventListener('open-pinnacle-ai', handleOpenAI);
    }, []);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const botResponseText = await getAIAssistantResponse(currentInput);
            const botMessage: Message = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = { id: (Date.now() + 1).toString(), text: "Sorry, I couldn't get a response.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-96 h-[500px] bg-surface rounded-2xl shadow-2xl border border-outline/20 flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="p-4 bg-primary text-on-primary flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SparklesIcon className="h-5 w-5 text-accent" />
                            <h3 className="font-serif font-bold tracking-wide">Pinnacle AI</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-surface-variant/30 custom-scrollbar">
                        <div className="space-y-3">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${msg.sender === 'user'
                                            ? 'bg-primary text-on-primary rounded-br-none'
                                            : 'bg-white border border-outline/10 text-on-surface rounded-bl-none shadow-sm'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-outline/10 px-3 py-2 rounded-2xl rounded-bl-none shadow-sm">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-0"></div>
                                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-surface border-t border-outline/10">
                        <form onSubmit={handleSendMessage} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask anything..."
                                className="w-full pl-4 pr-10 py-2.5 bg-surface-variant/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/20"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-1.5 p-1.5 bg-primary text-on-primary rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <SendIcon className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button - Hidden on Mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`hidden lg:flex p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen
                    ? 'bg-surface text-primary border border-outline/20 hover:bg-surface-variant'
                    : 'bg-gradient-to-br from-primary to-[#1a3c66] text-on-primary hover:shadow-primary/30'
                    }`}
            >
                {isOpen ? (
                    <XIcon className="h-6 w-6" />
                ) : (
                    <SparklesIcon className="h-6 w-6" />
                )}
            </button>
        </div>
    );
};

export default GlobalChatWidget;
