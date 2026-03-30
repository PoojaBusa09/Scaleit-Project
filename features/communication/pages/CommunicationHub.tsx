/**
 * Enhanced Messages & Communication Hub
 * Features: 1-on-1 messages, group chats, AI summarization, rich message display
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import { PageHeader } from "../../../components/PageHeader.tsx";
import { useLocation } from "react-router-dom";
import { UserRole } from "../../../types.ts";
import {
  MOCK_CONVERSATIONS,
  MOCK_GROUP_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_GROUP_DETAILS,
  getAllConversations,
  getMessages,
  isGroupConversation,
  getGroupDetails,
  getGroupInitials,
  MESSAGING_USERS
} from "../../../data/mockMessages.ts";
import { Conversation, ChatMessage } from "../../../types.ts";
import {
  SearchIcon,
  SendIcon,
  PaperclipIcon,
  VideoCameraIcon,
  MoreVerticalIcon,
  SmileIcon,
  SparklesIcon,
  PhoneIcon,
  CheckCircleIcon,
  UsersIcon,
  PlusIcon,
  HashIcon,
  ChevronRightIcon,
} from "../../../components/icons.tsx";

// Note: Using text "×" for close button instead of missing XIcon

// Use XCircleIcon as close button, ChevronRightIcon for expand

// =============================================================================
// Components
// =============================================================================

const GroupAvatar: React.FC<{ name: string; size?: 'sm' | 'md' | 'lg' }> = ({ name, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500'
  ];

  const colorIndex = name.length % colors.length;

  return (
    <div className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-bold`}>
      {getGroupInitials(name)}
    </div>
  );
};

const ConversationItem: React.FC<{
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  isGroup: boolean;
}> = ({ conversation, isActive, onClick, isGroup }) => (
  <div
    onClick={onClick}
    className={`p-3 cursor-pointer hover:bg-surface-variant/30 transition-colors ${isActive
      ? "bg-primary-container/10 border-l-4 border-l-primary"
      : "border-l-4 border-l-transparent"
      }`}
  >
    <div className="flex gap-3">
      <div className="relative">
        {isGroup ? (
          <GroupAvatar name={conversation.name} size="lg" />
        ) : (
          <>
            <img
              src={conversation.avatarUrl}
              alt={conversation.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {conversation.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></div>
            )}
          </>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-1.5">
            {isGroup && <UsersIcon className="h-3.5 w-3.5 text-on-surface-variant" />}
            <h3 className={`text-sm font-semibold truncate ${isActive ? "text-primary" : "text-on-surface"}`}>
              {conversation.name}
            </h3>
          </div>
          <span className="text-xs text-on-surface-variant whitespace-nowrap ml-2">
            {conversation.timestamp}
          </span>
        </div>
        <p className={`text-sm truncate ${conversation.unreadCount > 0 ? "font-medium text-on-surface" : "text-on-surface-variant"}`}>
          {conversation.lastMessage}
        </p>
      </div>
      {conversation.unreadCount > 0 && (
        <div className="flex-shrink-0 self-center">
          <span className="bg-primary text-on-primary text-xs font-bold px-2 py-0.5 rounded-full">
            {conversation.unreadCount}
          </span>
        </div>
      )}
    </div>
  </div>
);

const ChatBubble: React.FC<{ message: ChatMessage; isLast: boolean; isGroup: boolean }> = ({
  message,
  isLast,
  isGroup
}) => {
  const isMe = message.senderType === "user";
  const isAISuggestion = message.senderType === "ai-suggestion";

  if (isAISuggestion) {
    return (
      <div className="flex justify-center my-4 animate-fade-in-up-fast">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 max-w-lg flex items-start gap-3 shadow-sm">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shrink-0">
            <SparklesIcon className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-1">
              Pinnacle AI Suggestion
            </p>
            <p className="text-sm text-on-surface-variant">{message.text}</p>
            <div className="flex gap-2 mt-2">
              <button className="text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                Apply
              </button>
              <button className="text-xs font-medium text-on-surface-variant hover:text-on-surface">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex ${isMe ? "justify-end" : "justify-start"} mb-2 animate-fade-in-up-fast`}>
      <div className={`flex max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
        {!isMe && (
          <div className="w-8 h-8 shrink-0">
            {isLast ? (
              <img
                src={message.avatarUrl}
                alt={message.sender}
                className="w-8 h-8 rounded-full object-cover shadow-sm border border-outline/10"
              />
            ) : (
              <div className="w-8" />
            )}
          </div>
        )}

        <div className={`relative px-4 py-2.5 shadow-sm text-sm ${isMe
          ? "bg-primary text-white rounded-2xl rounded-tr-sm"
          : "bg-surface text-on-surface rounded-2xl rounded-tl-sm border border-outline/10"
          }`}>
          {isGroup && !isMe && isLast && (
            <p className="text-xs font-medium text-primary mb-1">{message.sender}</p>
          )}
          <p className={`leading-relaxed whitespace-pre-wrap ${isMe ? "text-white" : ""}`}>{message.text}</p>
          <p className={`text-[10px] mt-1 text-right opacity-70 ${isMe ? "text-white" : "text-on-surface-variant"}`}>
            {message.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

const CreateGroupModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, members: string[]) => void;
}> = ({ isOpen, onClose, onCreate }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (groupName && selectedMembers.length > 0) {
      onCreate(groupName, selectedMembers);
      setGroupName('');
      setSelectedMembers([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-primary p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UsersIcon className="w-6 h-6 text-on-primary" />
            <h2 className="text-lg font-semibold text-on-primary">Create Group</h2>
          </div>
          <button onClick={onClose} className="text-on-primary/80 hover:text-on-primary text-xl font-bold">
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Marketing Team"
              className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-on-surface focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">Add Members</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {MESSAGING_USERS.map(user => (
                <label key={user.id} className="flex items-center gap-3 p-2 hover:bg-surface-variant/50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers([...selectedMembers, user.id]);
                      } else {
                        setSelectedMembers(selectedMembers.filter(id => id !== user.id));
                      }
                    }}
                    className="w-4 h-4 text-primary rounded border-outline-variant"
                  />
                  <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">{user.name}</p>
                    <p className="text-xs text-on-surface-variant">{user.role}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-on-surface-variant bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!groupName || selectedMembers.length === 0}
              className="flex-1 px-4 py-3 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Main Component
// =============================================================================

const MEMBER_ROLES: UserRole[] = ['EC', 'SC', 'STM'];

const CommunicationHub: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const location = useLocation();
  const isMember = userRole ? MEMBER_ROLES.includes(userRole) : false;
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'groups'>('all');
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_1');
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allConversations = useMemo(() => getAllConversations(), []);

  const filteredConversations = useMemo(() => {
    let convs = allConversations;

    // Tab filter
    if (activeTab === 'direct') {
      convs = convs.filter(c => !isGroupConversation(c.id));
    } else if (activeTab === 'groups') {
      convs = convs.filter(c => isGroupConversation(c.id));
    }

    // Unread filter
    if (filter === "unread") {
      convs = convs.filter(c => c.unreadCount > 0);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      convs = convs.filter(c => c.name.toLowerCase().includes(q));
    }

    return convs;
  }, [allConversations, activeTab, filter, searchQuery]);

  const activeConversation = allConversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversationId ? getMessages(activeConversationId) : [];
  const isActiveGroup = activeConversationId ? isGroupConversation(activeConversationId) : false;
  const groupDetails = isActiveGroup && activeConversationId ? getGroupDetails(activeConversationId) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, activeConversationId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversationId) return;
    // Would add to messages here
    console.log('Sending:', newMessage);
    setNewMessage("");
  };

  const handleCreateGroup = (name: string, members: string[]) => {
    console.log('Creating group:', name, members);
    // Would create group here
  };

  const totalUnread = allConversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="-m-4 h-[calc(100vh)] flex flex-col bg-surface">
      {/* Header */}
      <div className="p-4 pb-2 z-10">
        <PageHeader
          title={isMember ? "Announcements" : "Messages"}
          description={isMember ? "Broadcasts and updates from Pinnacle" : "Stay connected with mentors, peers, and teams"}
          className="mb-0"
        />
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar */}
        <div className="w-80 flex flex-col border-r border-outline/20 bg-surface">
          {/* Tabs & Actions */}
          <div className="p-4 border-b border-outline/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-title-lg font-bold text-on-surface">Inbox</h2>
                {totalUnread > 0 && (
                  <span className="bg-primary text-on-primary text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalUnread}
                  </span>
                )}
              </div>
              {!isMember && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowCreateGroup(true)}
                    className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title="Create Group"
                  >
                    <UsersIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title="New Message"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-variant/50 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
            </div>

            {/* Tab Buttons — hidden for members (broadcast-only) */}
            {!isMember && (
              <div className="flex gap-1 bg-surface-variant/30 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'all' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('direct')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${activeTab === 'direct' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant'
                    }`}
                >
                  Direct
                </button>
                <button
                  onClick={() => setActiveTab('groups')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${activeTab === 'groups' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant'
                    }`}
                >
                  <UsersIcon className="w-3 h-3" />
                  Groups
                </button>
              </div>
            )}

            {/* Unread Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "all" ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant hover:bg-surface-variant"
                  }`}
              >
                All Messages
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === "unread" ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant hover:bg-surface-variant"
                  }`}
              >
                Unread
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversationId === conversation.id}
                  onClick={() => setActiveConversationId(conversation.id)}
                  isGroup={isGroupConversation(conversation.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-surface-variant/10">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-surface border-b border-outline/10 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                  {isActiveGroup ? (
                    <GroupAvatar name={activeConversation.name} size="md" />
                  ) : (
                    <img
                      src={activeConversation.avatarUrl}
                      alt={activeConversation.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-on-surface">{activeConversation.name}</h3>
                      {isActiveGroup && (
                        <span className="text-xs bg-surface-variant px-2 py-0.5 rounded-full text-on-surface-variant">
                          {groupDetails?.members.length || 0} members
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-on-surface-variant">
                      {isActiveGroup ? (
                        groupDetails?.description || 'Group chat'
                      ) : activeConversation.online ? (
                        <>
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                          Online
                        </>
                      ) : (
                        "Offline"
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowAISummary(!showAISummary)}
                    className={`p-2 rounded-full transition-colors flex items-center gap-1 ${showAISummary
                      ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
                      : 'text-on-surface-variant hover:bg-surface-variant'
                      }`}
                    title="AI Summary"
                  >
                    <SparklesIcon className="h-5 w-5" />
                  </button>
                  {!isActiveGroup && (
                    <>
                      <button className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">
                        <PhoneIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">
                        <VideoCameraIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <button className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">
                    <MoreVerticalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* AI Summary Panel */}
              {showAISummary && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-purple-200 dark:border-purple-800 p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-1">Thread Summary</h4>
                      <p className="text-sm text-on-surface-variant mb-2">
                        This conversation covers Q3 goals, CRM selection (decided on HubSpot), team expansion with 2 new hires, and financial forecasting. Key action items include completing HubSpot trial signup and finalizing product launch plan.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                          📋 2 Action Items
                        </span>
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                          ✅ 1 Decision Made
                        </span>
                        <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                          😊 Positive Tone
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAISummary(false)}
                      className="p-1 text-on-surface-variant hover:text-on-surface text-lg font-bold"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {activeMessages.map((msg, index) => (
                  <ChatBubble
                    key={msg.id}
                    message={msg}
                    isLast={
                      index === activeMessages.length - 1 ||
                      activeMessages[index + 1].sender !== msg.sender
                    }
                    isGroup={isActiveGroup}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area — hidden for members (read-only broadcast) */}
              {!isMember && (
                <div className="p-4 bg-surface border-t border-outline/10">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-end gap-2 bg-surface-variant/30 p-2 rounded-2xl border border-outline/10 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all"
                  >
                    <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Attach file">
                      <PaperclipIcon className="h-5 w-5" />
                    </button>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder={isActiveGroup ? `Message ${activeConversation.name}...` : "Type your message..."}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 resize-none py-2 max-h-32"
                      rows={1}
                    />
                    <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                      <SmileIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-2 bg-primary text-on-primary rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <SendIcon className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant">
              <div className="w-16 h-16 bg-surface-variant/50 rounded-full flex items-center justify-center mb-4">
                <UsersIcon className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm text-on-surface-variant/70 mt-1">Choose from your messages on the left</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreate={handleCreateGroup}
      />
    </div>
  );
};

export default CommunicationHub;
