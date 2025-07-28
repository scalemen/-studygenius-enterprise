import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  BookOpen, Brain, Users, Calendar, Camera, Search, 
  MessageCircle, Gamepad2, PenTool, Lightbulb, 
  CreditCard as Cards, Video, FileText, Trophy,
  TrendingUp, Clock, Star, Zap
} from 'lucide-react';

const Dashboard = () => {
  const [userName, setUserName] = useState('Student');
  const [studyStreak, setStudyStreak] = useState(7);
  const [todayProgress, setTodayProgress] = useState(65);

  // Feature cards configuration
  const features = [
    {
      id: 'notes',
      title: 'Smart Notes',
      description: 'Google Docs-like editor with AI assistance',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      path: '/notes',
      new: false
    },
    {
      id: 'drawing',
      title: 'Apple Pen Drawing',
      description: 'Natural handwriting with pressure sensitivity',
      icon: PenTool,
      gradient: 'from-purple-500 to-pink-500',
      path: '/drawing-notes',
      new: true
    },
    {
      id: 'chatbot',
      title: 'AI Tutor',
      description: 'GPT-4 powered educational assistant',
      icon: Brain,
      gradient: 'from-green-500 to-emerald-500',
      path: '/advanced-chatbot',
      new: false
    },
    {
      id: 'homework',
      title: 'Homework Solver',
      description: 'Take photos and get instant solutions',
      icon: Camera,
      gradient: 'from-orange-500 to-red-500',
      path: '/homework-helper',
      new: true
    },
    {
      id: 'flashcards',
      title: 'Smart Flashcards',
      description: 'Spaced repetition learning system',
      icon: Cards,
      gradient: 'from-indigo-500 to-blue-500',
      path: '/flashcards',
      new: false
    },
    {
      id: 'planner',
      title: 'Study Planner',
      description: 'AI-optimized scheduling and tracking',
      icon: Calendar,
      gradient: 'from-teal-500 to-cyan-500',
      path: '/study-planner',
      new: false
    },
    {
      id: 'messaging',
      title: 'Global Chat',
      description: 'Discord-like messaging and video calls',
      icon: MessageCircle,
      gradient: 'from-violet-500 to-purple-500',
      path: '/advanced-messaging',
      new: false
    },
    {
      id: 'games',
      title: 'Learning Games',
      description: '10 educational games with leaderboards',
      icon: Gamepad2,
      gradient: 'from-pink-500 to-rose-500',
      path: '/mini-games',
      new: true
    },
    {
      id: 'topic-search',
      title: 'Topic Explorer',
      description: 'AI explanations and auto-generated quizzes',
      icon: Search,
      gradient: 'from-amber-500 to-orange-500',
      path: '/topic-search',
      new: false
    },
    {
      id: 'study-rooms',
      title: 'Virtual Study Rooms',
      description: 'Collaborative video spaces with whiteboards',
      icon: Video,
      gradient: 'from-emerald-500 to-teal-500',
      path: '/virtual-study-rooms',
      new: true
    },
    {
      id: 'research',
      title: 'Research Assistant',
      description: 'Academic papers and citation generator',
      icon: FileText,
      gradient: 'from-slate-500 to-gray-500',
      path: '/research-assistant',
      new: true
    },
    {
      id: 'group-quiz',
      title: 'Group Quizzes',
      description: 'Kahoot-style multiplayer competitions',
      icon: Trophy,
      gradient: 'from-yellow-500 to-amber-500',
      path: '/group-quiz',
      new: true
    }
  ];

  const stats = [
    { label: 'Study Streak', value: `${studyStreak} days`, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Today\'s Progress', value: `${todayProgress}%`, icon: Clock, color: 'text-blue-600' },
    { label: 'Total Points', value: '2,847', icon: Star, color: 'text-yellow-600' },
    { label: 'Rank', value: '#42', icon: Trophy, color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {userName}! 🚀
            </h1>
            <p className="text-gray-600 mt-2">Ready to revolutionize your learning today?</p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Zap className="w-5 h-5 inline mr-2" />
              Quick Start
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🌟 Revolutionary Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative group"
            >
              <Link href={feature.path}>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  {feature.new && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      NEW
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-purple-600 transition-colors">
                    Explore <Lightbulb className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/advanced-chatbot">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              🤖 Ask AI Tutor
            </motion.button>
          </Link>
          
          <Link href="/homework-helper">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              📸 Solve Homework
            </motion.button>
          </Link>
          
          <Link href="/mini-games">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              🎮 Play & Learn
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Achievement Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg"
      >
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6" />
          <div>
            <p className="text-sm font-semibold">Daily Goal</p>
            <p className="text-xs opacity-90">{todayProgress}% Complete</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;