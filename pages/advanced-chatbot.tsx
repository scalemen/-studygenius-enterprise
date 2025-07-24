import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { 
  Send, 
  Mic, 
  MicOff, 
  Image, 
  FileText, 
  Download, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw,
  Settings,
  Zap,
  Brain,
  Sparkles,
  MessageSquare,
  Clock,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Target,
  Star,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  SortDesc,
  Archive,
  Trash2,
  Edit3,
  Volume2,
  VolumeX,
  Pause,
  Play,
  SkipForward,
  SkipBack,
  RotateCcw,
  Save,
  Upload,
  Link,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero
} from 'lucide-react';

// Types and Interfaces
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  tokens?: number;
  model?: string;
  confidence?: number;
  sources?: string[];
  reactions?: Reaction[];
  attachments?: Attachment[];
  metadata?: MessageMetadata;
}

interface Reaction {
  type: 'like' | 'dislike' | 'love' | 'star' | 'bookmark';
  userId: string;
  timestamp: Date;
}

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video';
  url: string;
  size: number;
  mimeType: string;
}

interface MessageMetadata {
  processingTime: number;
  tokensUsed: number;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  archived: boolean;
  pinned: boolean;
  shared: boolean;
  model: string;
  systemPrompt?: string;
  settings: ConversationSettings;
}

interface ConversationSettings {
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'gemini-pro';
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt: string;
  enableWebSearch: boolean;
  enableCodeExecution: boolean;
  enableImageGeneration: boolean;
  voiceEnabled: boolean;
  language: string;
  responseFormat: 'text' | 'markdown' | 'json';
}

interface AIResponse {
  content: string;
  tokens: number;
  confidence: number;
  sources: string[];
  relatedTopics: string[];
  suggestedActions: string[];
  model: string;
  processingTime: number;
}

interface ConversationStats {
  totalMessages: number;
  totalTokens: number;
  averageResponseTime: number;
  topicsDiscussed: string[];
  mostUsedModel: string;
  totalCost: number;
  satisfaction: number;
}

// Advanced Chatbot Component
export default function AdvancedChatbot() {
  // State Management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedModel, setSelectedModel] = useState<'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'gemini-pro'>('gpt-4');
  const [settings, setSettings] = useState<ConversationSettings>({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: 'You are StudyGenius AI, an advanced educational assistant designed to help students and professionals learn, understand complex topics, solve problems, and achieve their academic and career goals. You are knowledgeable, patient, encouraging, and always strive to provide accurate, helpful, and educational responses.',
    enableWebSearch: true,
    enableCodeExecution: false,
    enableImageGeneration: false,
    voiceEnabled: true,
    language: 'en',
    responseFormat: 'markdown'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'starred' | 'archived'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'most-active'>('newest');
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [conversationStats, setConversationStats] = useState<ConversationStats | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    "Explain quantum physics in simple terms",
    "Help me write a research paper outline",
    "Solve this calculus problem step by step",
    "What are the best study techniques for memorization?",
    "Explain machine learning algorithms",
    "Help me prepare for a job interview",
    "Create a study schedule for my exams",
    "Explain the causes of World War II"
  ]);
  const [recentTopics, setRecentTopics] = useState<string[]>([
    'Mathematics', 'Physics', 'Computer Science', 'History', 'Biology', 'Chemistry'
  ]);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Effects
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentConversation) {
      setMessages(currentConversation.messages);
      setSettings(currentConversation.settings);
    }
  }, [currentConversation]);

  useEffect(() => {
    // Load conversations from localStorage
    const savedConversations = localStorage.getItem('studygenius-conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed);
      if (parsed.length > 0) {
        setCurrentConversation(parsed[0]);
      }
    }
  }, []);

  useEffect(() => {
    // Auto-save conversations
    if (conversations.length > 0) {
      localStorage.setItem('studygenius-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Helper Functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      }).format(date);
    }
  };

  const calculateTokens = (text: string): number => {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  };

  const estimateCost = (tokens: number, model: string): number => {
    const rates = {
      'gpt-4': 0.03 / 1000, // $0.03 per 1K tokens
      'gpt-3.5-turbo': 0.002 / 1000, // $0.002 per 1K tokens
      'claude-3': 0.015 / 1000, // $0.015 per 1K tokens
      'gemini-pro': 0.001 / 1000 // $0.001 per 1K tokens
    };
    return tokens * (rates[model as keyof typeof rates] || 0.01);
  };

  // Core Functions
  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      archived: false,
      pinned: false,
      shared: false,
      model: selectedModel,
      systemPrompt: settings.systemPrompt,
      settings: { ...settings }
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    setMessages([]);
  }, [selectedModel, settings]);

  const sendMessage = useCallback(async (content: string, attachments?: Attachment[]) => {
    if (!content.trim() && !attachments?.length) return;

    const userMessage: Message = {
      id: generateId(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      attachments: attachments || [],
      metadata: {
        processingTime: 0,
        tokensUsed: calculateTokens(content),
        model: selectedModel,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        topP: settings.topP,
        frequencyPenalty: settings.frequencyPenalty,
        presencePenalty: settings.presencePenalty
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate AI response with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const aiResponse = await generateAIResponse(content, selectedModel);
      
      const assistantMessage: Message = {
        id: generateId(),
        content: aiResponse.content,
        role: 'assistant',
        timestamp: new Date(),
        tokens: aiResponse.tokens,
        model: aiResponse.model,
        confidence: aiResponse.confidence,
        sources: aiResponse.sources,
        reactions: [],
        metadata: {
          processingTime: aiResponse.processingTime,
          tokensUsed: aiResponse.tokens,
          model: aiResponse.model,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          topP: settings.topP,
          frequencyPenalty: settings.frequencyPenalty,
          presencePenalty: settings.presencePenalty
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update conversation
      if (currentConversation) {
        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, userMessage, assistantMessage],
          updatedAt: new Date(),
          title: currentConversation.messages.length === 0 ? content.substring(0, 50) + '...' : currentConversation.title
        };

        setCurrentConversation(updatedConversation);
        setConversations(prev => 
          prev.map(conv => conv.id === updatedConversation.id ? updatedConversation : conv)
        );
      }

      // Update suggested prompts based on response
      if (aiResponse.suggestedActions.length > 0) {
        setSuggestedPrompts(aiResponse.suggestedActions.slice(0, 4));
      }

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: generateId(),
        content: 'I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.',
        role: 'assistant',
        timestamp: new Date(),
        tokens: 0,
        model: selectedModel,
        confidence: 0,
        sources: [],
        reactions: []
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [currentConversation, selectedModel, settings]);

  const generateAIResponse = async (prompt: string, model: string): Promise<AIResponse> => {
    // Simulate AI API call with realistic response
    const responses = [
      {
        content: `I'd be happy to help you with that! Let me break this down step by step:\n\n## Understanding the Concept\n\n${prompt} is a fascinating topic that involves several key components:\n\n1. **First Principle**: The fundamental concept here is based on established theories and research.\n\n2. **Practical Application**: In real-world scenarios, this manifests as:\n   - Specific example A\n   - Specific example B\n   - Practical use case C\n\n3. **Advanced Considerations**: For deeper understanding, consider:\n   - Complex interaction patterns\n   - Potential challenges and solutions\n   - Future developments in this area\n\n## Key Takeaways\n\n- Remember that mastery comes through practice\n- Start with basic concepts before advancing\n- Apply these principles to real situations\n\n## Suggested Next Steps\n\n1. Practice with simple examples\n2. Explore related topics\n3. Apply knowledge to projects\n\nWould you like me to elaborate on any specific aspect or provide more detailed examples?`,
        tokens: 245,
        confidence: 0.92,
        sources: [
          'Educational Research Database',
          'Peer-reviewed Academic Papers',
          'StudyGenius Knowledge Base'
        ],
        relatedTopics: [
          'Advanced Applications',
          'Related Theories',
          'Practical Examples',
          'Common Misconceptions'
        ],
        suggestedActions: [
          'Can you provide a specific example?',
          'What are the common challenges with this?',
          'How does this relate to [related topic]?',
          'Can you create a practice problem for me?'
        ],
        model: model,
        processingTime: 1247
      },
      {
        content: `Excellent question! This is actually one of the most important concepts in this field. Let me provide you with a comprehensive explanation:\n\n## Background Context\n\nTo fully understand ${prompt}, we need to first establish the foundational knowledge:\n\n### Historical Development\n- **Early discoveries** (Timeline and key figures)\n- **Modern developments** (Recent advances)\n- **Current state** (Where we are today)\n\n### Core Principles\n\n1. **Principle One**: Detailed explanation with examples\n   - Supporting evidence\n   - Real-world applications\n   - Common variations\n\n2. **Principle Two**: Comprehensive breakdown\n   - Mathematical foundations\n   - Logical reasoning\n   - Practical implications\n\n3. **Principle Three**: Advanced concepts\n   - Complex interactions\n   - Edge cases\n   - Future possibilities\n\n## Practical Applications\n\n### In Academic Settings\n- Research applications\n- Study methodologies\n- Assessment techniques\n\n### In Professional Contexts\n- Industry applications\n- Career relevance\n- Skill development\n\n### In Daily Life\n- Personal benefits\n- Practical uses\n- Long-term value\n\n## Common Challenges and Solutions\n\n| Challenge | Solution | Tips |\n|-----------|----------|------|\n| Understanding basics | Start with fundamentals | Use visual aids |\n| Applying concepts | Practice regularly | Work through examples |\n| Remembering details | Create memory aids | Use spaced repetition |\n\n## Advanced Topics\n\nOnce you've mastered the basics, you might want to explore:\n\n- **Advanced Theory A**: Complex mathematical models\n- **Advanced Theory B**: Interdisciplinary connections\n- **Advanced Theory C**: Cutting-edge research\n\n## Resources for Further Learning\n\n1. **Books**: Recommended reading list\n2. **Online Courses**: Structured learning paths\n3. **Practice Materials**: Exercises and problems\n4. **Community**: Study groups and forums\n\nWould you like me to dive deeper into any particular aspect, or do you have specific questions about implementation?`,
        tokens: 387,
        confidence: 0.95,
        sources: [
          'Academic Textbooks',
          'Research Publications',
          'Expert Interviews',
          'Case Studies'
        ],
        relatedTopics: [
          'Foundational Concepts',
          'Advanced Applications',
          'Research Methods',
          'Industry Practices',
          'Historical Context'
        ],
        suggestedActions: [
          'Show me a step-by-step example',
          'What are the prerequisites for learning this?',
          'Can you recommend specific resources?',
          'How long does it typically take to master this?'
        ],
        model: model,
        processingTime: 2156
      }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      ...randomResponse,
      content: randomResponse.content.replace('${prompt}', prompt)
    };
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  const handleReaction = (messageId: string, reactionType: Reaction['type']) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find(r => r.type === reactionType);
          if (existingReaction) {
            // Remove reaction if it already exists
            return {
              ...msg,
              reactions: msg.reactions?.filter(r => r.type !== reactionType) || []
            };
          } else {
            // Add new reaction
            const newReaction: Reaction = {
              type: reactionType,
              userId: 'current-user',
              timestamp: new Date()
            };
            return {
              ...msg,
              reactions: [...(msg.reactions || []), newReaction]
            };
          }
        }
        return msg;
      })
    );
  };

  const copyMessageContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Show toast notification
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const exportConversation = (format: 'txt' | 'json' | 'pdf') => {
    if (!currentConversation) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${currentConversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}`;

    if (format === 'txt') {
      const content = currentConversation.messages
        .map(msg => `${msg.role.toUpperCase()}: ${msg.content}\n---\n`)
        .join('\n');
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify(currentConversation, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Process audio blob (convert to text using speech recognition)
        processAudioToText(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const processAudioToText = async (audioBlob: Blob) => {
    // Simulate speech-to-text processing
    setTimeout(() => {
      const transcribedText = "This is a simulated transcription of the audio input.";
      setInputMessage(transcribedText);
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const attachments: Attachment[] = Array.from(files).map(file => ({
      id: generateId(),
      name: file.name,
      type: getFileType(file.type),
      url: URL.createObjectURL(file),
      size: file.size,
      mimeType: file.type
    }));

    // Process attachments and send message
    sendMessage(inputMessage, attachments);
  };

  const getFileType = (mimeType: string): Attachment['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'recent' && new Date(conv.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) ||
                         (filterType === 'starred' && conv.pinned) ||
                         (filterType === 'archived' && conv.archived);

    return matchesSearch && matchesFilter;
  });

  const sortedConversations = filteredConversations.sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'oldest':
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      case 'most-active':
        return b.messages.length - a.messages.length;
      default:
        return 0;
    }
  });

  // Render Components
  const renderMessage = (message: Message) => (
    <div key={message.id} className={`flex gap-4 p-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        {message.role === 'user' ? (
          <AvatarFallback className="bg-blue-100 text-blue-600">U</AvatarFallback>
        ) : (
          <AvatarFallback className="bg-purple-100 text-purple-600">AI</AvatarFallback>
        )}
      </Avatar>
      
      <div className={`flex-1 space-y-2 ${message.role === 'user' ? 'text-right' : ''}`}>
        <div className={`inline-block max-w-[80%] p-4 rounded-2xl ${
          message.role === 'user' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="prose prose-sm max-w-none">
            {message.content}
          </div>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map(attachment => (
                <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{attachment.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {(attachment.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={`flex items-center gap-2 text-xs text-gray-500 ${message.role === 'user' ? 'justify-end' : ''}`}>
          <span>{formatTime(message.timestamp)}</span>
          {message.tokens && (
            <Badge variant="outline" className="text-xs">
              {message.tokens} tokens
            </Badge>
          )}
          {message.model && (
            <Badge variant="outline" className="text-xs">
              {message.model}
            </Badge>
          )}
          {message.confidence && (
            <Badge variant="outline" className="text-xs">
              {Math.round(message.confidence * 100)}% confidence
            </Badge>
          )}
        </div>
        
        {message.role === 'assistant' && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction(message.id, 'like')}
              className={`h-8 px-2 ${message.reactions?.some(r => r.type === 'like') ? 'bg-green-100 text-green-600' : ''}`}
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction(message.id, 'dislike')}
              className={`h-8 px-2 ${message.reactions?.some(r => r.type === 'dislike') ? 'bg-red-100 text-red-600' : ''}`}
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyMessageContent(message.content)}
              className="h-8 px-2"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction(message.id, 'bookmark')}
              className={`h-8 px-2 ${message.reactions?.some(r => r.type === 'bookmark') ? 'bg-yellow-100 text-yellow-600' : ''}`}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-2">Sources:</div>
            <div className="space-y-1">
              {message.sources.map((source, index) => (
                <div key={index} className="text-sm text-blue-700">• {source}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderConversationItem = (conversation: Conversation) => (
    <div
      key={conversation.id}
      onClick={() => setCurrentConversation(conversation)}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        currentConversation?.id === conversation.id 
          ? 'bg-blue-100 border-blue-200' 
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{conversation.title}</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatDate(conversation.updatedAt)} • {conversation.messages.length} messages
          </div>
          {conversation.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {conversation.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {conversation.pinned && <Star className="w-3 h-3 text-yellow-500" />}
          {conversation.shared && <Share2 className="w-3 h-3 text-blue-500" />}
          {conversation.archived && <Archive className="w-3 h-3 text-gray-400" />}
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-2rem)] bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gradient">StudyGenius AI</h1>
              <Button onClick={createNewConversation} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
            
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="all">All</option>
                  <option value="recent">Recent</option>
                  <option value="starred">Starred</option>
                  <option value="archived">Archived</option>
                </select>
                
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="most-active">Most Active</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Conversations List */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {sortedConversations.length > 0 ? (
                sortedConversations.map(renderConversationItem)
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No conversations found</p>
                  <p className="text-sm">Start a new chat to begin</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Stats and Settings */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStats(!showStats)}
                className="flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Stats
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="flex-1"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{currentConversation.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{currentConversation.messages.length} messages</span>
                      <span>Model: {currentConversation.model}</span>
                      <span>Updated: {formatDate(currentConversation.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportConversation('txt')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map(renderMessage)
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-12 h-12 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
                      <p className="text-gray-600 mb-6">Ask me anything! I'm here to help you learn and understand complex topics.</p>
                      
                      {/* Suggested Prompts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                        {suggestedPrompts.slice(0, 4).map((prompt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleSuggestedPrompt(prompt)}
                            className="text-left h-auto p-4 hover:bg-blue-50"
                          >
                            <Lightbulb className="w-4 h-4 mr-3 text-yellow-500 flex-shrink-0" />
                            <span className="text-sm">{prompt}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-4 p-4">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-100 text-purple-600">AI</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-2xl">
                        <div className="loading-dots">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                {/* Model Selector */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Model:</span>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value as any)}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="gpt-4">GPT-4 (Most Capable)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                      <option value="claude-3">Claude 3 (Analytical)</option>
                      <option value="gemini-pro">Gemini Pro (Multimodal)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Zap className="w-4 h-4" />
                    <span>Temperature: {settings.temperature}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>Max tokens: {settings.maxTokens}</span>
                  </div>
                </div>
                
                {/* Recent Topics */}
                {recentTopics.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Recent topics:</div>
                    <div className="flex gap-2 flex-wrap">
                      {recentTopics.map((topic, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestedPrompt(`Tell me more about ${topic}`)}
                          className="text-xs h-7"
                        >
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Input Form */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything about your studies..."
                      className="min-h-[60px] max-h-[200px] resize-none pr-12"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(inputMessage);
                        }
                      }}
                    />
                    
                    {/* Input Actions */}
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 w-8 p-0"
                      >
                        <Image className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`h-8 w-8 p-0 ${isRecording ? 'text-red-500' : ''}`}
                      >
                        {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    {/* Recording Indicator */}
                    {isRecording && (
                      <div className="absolute top-2 left-2 flex items-center gap-2 bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        Recording: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={isLoading || (!inputMessage.trim())}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {/* Character Count */}
                <div className="text-xs text-gray-500 mt-2 text-right">
                  {inputMessage.length} characters • ~{calculateTokens(inputMessage)} tokens
                </div>
                
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-16 h-16 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Welcome to StudyGenius AI</h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Your intelligent study companion powered by advanced AI. Start a new conversation to begin learning!
                </p>
                <Button onClick={createNewConversation} className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start New Conversation
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>AI Settings</span>
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="model" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="model">Model</TabsTrigger>
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  <TabsTrigger value="behavior">Behavior</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="model" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">AI Model</label>
                    <select
                      value={settings.model}
                      onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value as any }))}
                      className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="gpt-4">GPT-4 - Most capable, slower, higher cost</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo - Fast, efficient, lower cost</option>
                      <option value="claude-3">Claude 3 - Excellent for analysis and reasoning</option>
                      <option value="gemini-pro">Gemini Pro - Multimodal capabilities</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">System Prompt</label>
                    <Textarea
                      value={settings.systemPrompt}
                      onChange={(e) => setSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
                      className="mt-1 min-h-[100px]"
                      placeholder="Define how the AI should behave..."
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="parameters" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Temperature: {settings.temperature}</label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.temperature}
                      onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      className="w-full mt-1"
                    />
                    <div className="text-xs text-gray-600 mt-1">Controls randomness. Lower = more focused, Higher = more creative</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Max Tokens: {settings.maxTokens}</label>
                    <input
                      type="range"
                      min="256"
                      max="4096"
                      step="256"
                      value={settings.maxTokens}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                      className="w-full mt-1"
                    />
                    <div className="text-xs text-gray-600 mt-1">Maximum length of AI responses</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Top P: {settings.topP}</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.topP}
                      onChange={(e) => setSettings(prev => ({ ...prev, topP: parseFloat(e.target.value) }))}
                      className="w-full mt-1"
                    />
                    <div className="text-xs text-gray-600 mt-1">Controls diversity via nucleus sampling</div>
                  </div>
                </TabsContent>
                
                <TabsContent value="behavior" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Enable Web Search</label>
                      <input
                        type="checkbox"
                        checked={settings.enableWebSearch}
                        onChange={(e) => setSettings(prev => ({ ...prev, enableWebSearch: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Enable Code Execution</label>
                      <input
                        type="checkbox"
                        checked={settings.enableCodeExecution}
                        onChange={(e) => setSettings(prev => ({ ...prev, enableCodeExecution: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Enable Image Generation</label>
                      <input
                        type="checkbox"
                        checked={settings.enableImageGeneration}
                        onChange={(e) => setSettings(prev => ({ ...prev, enableImageGeneration: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Voice Enabled</label>
                      <input
                        type="checkbox"
                        checked={settings.voiceEnabled}
                        onChange={(e) => setSettings(prev => ({ ...prev, voiceEnabled: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Response Format</label>
                    <select
                      value={settings.responseFormat}
                      onChange={(e) => setSettings(prev => ({ ...prev, responseFormat: e.target.value as any }))}
                      className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="text">Plain Text</option>
                      <option value="markdown">Markdown</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Frequency Penalty: {settings.frequencyPenalty}</label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={settings.frequencyPenalty}
                      onChange={(e) => setSettings(prev => ({ ...prev, frequencyPenalty: parseFloat(e.target.value) }))}
                      className="w-full mt-1"
                    />
                    <div className="text-xs text-gray-600 mt-1">Reduces repetition of frequent tokens</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Presence Penalty: {settings.presencePenalty}</label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={settings.presencePenalty}
                      onChange={(e) => setSettings(prev => ({ ...prev, presencePenalty: parseFloat(e.target.value) }))}
                      className="w-full mt-1"
                    />
                    <div className="text-xs text-gray-600 mt-1">Encourages talking about new topics</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowSettings(false)}>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conversation Statistics</span>
                <Button variant="ghost" size="sm" onClick={() => setShowStats(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{conversations.length}</div>
                    <div className="text-sm text-gray-600">Total Conversations</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">
                      {conversations.reduce((total, conv) => total + conv.messages.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Messages</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">1.2s</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold">GPT-4</div>
                    <div className="text-sm text-gray-600">Most Used Model</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-red-600" />
                    <div className="text-2xl font-bold">
                      {conversations.reduce((total, conv) => 
                        total + conv.messages.reduce((msgTotal, msg) => msgTotal + (msg.tokens || 0), 0), 0
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Total Tokens Used</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <div className="text-2xl font-bold">4.8/5</div>
                    <div className="text-sm text-gray-600">Satisfaction Rating</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {recentTopics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
