import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ChatConversation, ChatMessage, Farm } from '../types';
import { ConversationList } from '../components/chat/ConversationList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { Select } from '../components/common/Select';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';

export const ChatPage: React.FC = () => {
  const { showToast } = useToast();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([]);

  // New Chat Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('New Advisory Consultation');
  const [newFarmId, setNewFarmId] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/chat/conversations'),
      api.get('/farms'),
    ])
      .then(([convRes, farmRes]) => {
        const list = convRes.data?.conversations || [];
        setConversations(list);
        const farmList = farmRes.data?.farms || [];
        setFarms(farmList);
        if (farmList.length > 0) setNewFarmId(farmList[0].id);

        if (list.length > 0) {
          setActiveConvId(list[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeConvId) return;
    api.get(`/chat/conversations/${activeConvId}/messages`)
      .then((res) => setMessages(res.data?.messages || []))
      .catch((err) => console.error(err));
  }, [activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSendMessage = async (content: string) => {
    if (!activeConvId) return;
    setIsSending(true);
    try {
      const res = await api.post(`/chat/conversations/${activeConvId}/messages`, { content });
      setMessages((prev) => [...prev, res.data.userMessage, res.data.assistantMessage]);
      if (res.data?.suggestedFollowUps) {
        setSuggestedFollowUps(res.data.suggestedFollowUps);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to send message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/chat/conversations', {
        title: newTitle,
        farm_id: newFarmId || undefined,
      });
      const created = res.data.conversation;
      setConversations((prev) => [created, ...prev]);
      setActiveConvId(created.id);
      setIsModalOpen(false);
      showToast('New chat thread created!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to create chat thread', 'error');
    }
  };

  if (loading) return <LoadingSpinner label="Loading chat threads..." />;

  const farmOptions = farms.map((f) => ({
    value: f.id,
    label: `${f.farm_name} (${f.district})`,
  }));

  return (
    <div className="h-[calc(100vh-10rem)] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div className="md:col-span-1 h-full">
        <ConversationList
          conversations={conversations}
          activeId={activeConvId}
          onSelect={(id) => setActiveConvId(id)}
          onNew={() => setIsModalOpen(true)}
        />
      </div>

      <div className="md:col-span-2 lg:col-span-3 h-full">
        <ChatWindow
          conversation={activeConv}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isSending}
          suggestedFollowUps={suggestedFollowUps}
        />
      </div>

      {/* Create New Chat Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Advisory Thread">
        <form onSubmit={handleCreateThread} className="space-y-4">
          <Input
            label="Thread Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          {farms.length > 0 && (
            <Select
              label="Grounding Farm Profile"
              options={farmOptions}
              value={newFarmId}
              onChange={(e) => setNewFarmId(e.target.value)}
            />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Start Chat</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
