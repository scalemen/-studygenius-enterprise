import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Brain, Target, CheckCircle, 
  Plus, Edit, Trash2, AlertCircle, BookOpen,
  TrendingUp, Award, Zap, Timer, Users, Bell
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  estimatedTime: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'homework' | 'study' | 'exam' | 'project';
  aiSuggested?: boolean;
}

interface StudySession {
  id: string;
  taskId: string;
  date: Date;
  startTime: string;
  duration: number;
  completed: boolean;
}

const StudyPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);

  // Mock data initialization
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Math Homework - Calculus Chapter 5',
        subject: 'Mathematics',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        estimatedTime: 90,
        priority: 'high',
        completed: false,
        difficulty: 'hard',
        type: 'homework'
      },
      {
        id: '2',
        title: 'History Essay - World War II',
        subject: 'History',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        estimatedTime: 120,
        priority: 'medium',
        completed: false,
        difficulty: 'medium',
        type: 'project'
      },
      {
        id: '3',
        title: 'Physics Lab Report',
        subject: 'Physics',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        estimatedTime: 60,
        priority: 'high',
        completed: true,
        difficulty: 'medium',
        type: 'homework'
      },
      {
        id: '4',
        title: 'Chemistry Exam Preparation',
        subject: 'Chemistry',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedTime: 180,
        priority: 'high',
        completed: false,
        difficulty: 'hard',
        type: 'exam',
        aiSuggested: true
      }
    ];

    const mockSessions: StudySession[] = [
      {
        id: '1',
        taskId: '1',
        date: new Date(),
        startTime: '14:00',
        duration: 45,
        completed: false
      },
      {
        id: '2',
        taskId: '2',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        startTime: '16:00',
        duration: 60,
        completed: false
      }
    ];

    setTasks(mockTasks);
    setStudySessions(mockSessions);
  }, []);

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Mathematics': 'from-blue-500 to-cyan-500',
      'History': 'from-orange-500 to-red-500',
      'Physics': 'from-purple-500 to-pink-500',
      'Chemistry': 'from-green-500 to-emerald-500',
      'Biology': 'from-teal-500 to-blue-500'
    };
    return colors[subject] || 'from-gray-500 to-gray-600';
  };

  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);

  const todayTasks = tasks.filter(task => {
    const today = new Date();
    return task.dueDate.toDateString() === today.toDateString();
  });

  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)
    : 0;

  const totalStudyTime = tasks
    .filter(task => task.completed)
    .reduce((total, task) => total + task.estimatedTime, 0);

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              📅 Smart Study Planner
            </h1>
            <p className="text-gray-600 mt-2">AI-optimized scheduling and progress tracking</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">{completionRate}%</p>
              <p className="text-sm text-gray-500">Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{Math.round(totalStudyTime / 60)}h</p>
              <p className="text-sm text-gray-500">Study Time</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddTask(true)}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Task</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6" />
              <h3 className="text-xl font-bold">AI Study Recommendations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-semibold mb-2">📊 Optimal Study Time</h4>
                <p className="text-sm opacity-90">Your peak focus hours are 2-4 PM. Schedule challenging tasks during this time.</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-semibold mb-2">⚡ Quick Win</h4>
                <p className="text-sm opacity-90">Complete 2 small tasks first to build momentum for today.</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-semibold mb-2">🎯 Priority Alert</h4>
                <p className="text-sm opacity-90">Math homework due in 2 days needs immediate attention.</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-semibold mb-2">🔄 Break Reminder</h4>
                <p className="text-sm opacity-90">Take a 15-minute break every hour for better retention.</p>
              </div>
            </div>
          </motion.div>

          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Today's Schedule</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>

            {todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No tasks scheduled for today</p>
                <p className="text-sm text-gray-400">Great job staying ahead!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {studySessions
                  .filter(session => session.date.toDateString() === selectedDate.toDateString())
                  .map((session) => {
                    const task = tasks.find(t => t.id === session.taskId);
                    if (!task) return null;

                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          session.completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r text-white rounded-xl">
                              <Timer className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{task.title}</h4>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-sm text-blue-600 font-medium">{session.startTime}</span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">{session.duration} min</span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleTaskComplete(task.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              session.completed 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            }`}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            )}
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">Upcoming Tasks</h3>
            
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    task.completed 
                      ? 'bg-green-50 border-green-200 opacity-60' 
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleTaskComplete(task.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {task.completed && <CheckCircle className="w-4 h-4" />}
                      </motion.button>
                      
                      <div className={`w-3 h-3 bg-gradient-to-r ${getSubjectColor(task.subject)} rounded-full`}></div>
                      
                      <div className="flex-1">
                        <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-sm text-gray-500">{task.subject}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{task.estimatedTime} min</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">
                            Due {task.dueDate.toLocaleDateString()}
                          </span>
                          {task.aiSuggested && (
                            <>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
                                AI Suggested
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">Progress Overview</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Weekly Goal</span>
                  <span className="font-semibold text-gray-800">{completionRate}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-blue-50 rounded-lg p-3">
                  <Target className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Completed</p>
                  <p className="text-lg font-bold text-blue-600">{tasks.filter(t => t.completed).length}</p>
                </div>
                <div className="text-center bg-orange-50 rounded-lg p-3">
                  <Clock className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-lg font-bold text-orange-600">{tasks.filter(t => !t.completed).length}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Study Streak */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-800">Study Streak</h3>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">7</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">Days in a row!</p>
              <p className="text-sm text-gray-600">Keep it up to reach your goal</p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
            </div>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>Generate Study Plan</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Join Study Group</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Bell className="w-4 h-4" />
                <span>Set Reminders</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Subject Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-800">Subject Distribution</h3>
            </div>
            
            <div className="space-y-3">
              {['Mathematics', 'History', 'Physics', 'Chemistry'].map((subject) => {
                const subjectTasks = tasks.filter(task => task.subject === subject);
                const percentage = tasks.length > 0 ? (subjectTasks.length / tasks.length) * 100 : 0;
                
                return (
                  <div key={subject} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 bg-gradient-to-r ${getSubjectColor(subject)} rounded-full`}></div>
                      <span className="text-sm font-medium text-gray-700">{subject}</span>
                    </div>
                    <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;