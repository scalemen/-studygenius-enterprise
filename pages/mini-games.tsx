import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Gamepad2, Trophy, Star, Clock, Users, Brain, 
  Calculator, Globe, Book, Zap, Target, Puzzle,
  Crown, Medal, Award, Timer, Play, Pause, RotateCcw
} from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  players: number;
  avgTime: string;
  gradient: string;
  isNew?: boolean;
  isPremium?: boolean;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  country: string;
}

const MiniGames = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);

  const games: Game[] = [
    {
      id: 'math-rush',
      title: 'Math Rush',
      description: 'Solve equations as fast as you can in this thrilling math challenge',
      icon: Calculator,
      category: 'Math',
      difficulty: 'medium',
      players: 45236,
      avgTime: '3 min',
      gradient: 'from-blue-500 to-cyan-500',
      isNew: true
    },
    {
      id: 'word-wizard',
      title: 'Word Wizard',
      description: 'Unscramble words and expand your vocabulary',
      icon: Book,
      category: 'Language',
      difficulty: 'easy',
      players: 38492,
      avgTime: '5 min',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'geography-master',
      title: 'Geography Master',
      description: 'Test your knowledge of countries, capitals, and landmarks',
      icon: Globe,
      category: 'Geography',
      difficulty: 'hard',
      players: 29847,
      avgTime: '7 min',
      gradient: 'from-purple-500 to-pink-500',
      isPremium: true
    },
    {
      id: 'brain-teaser',
      title: 'Brain Teaser',
      description: 'Logic puzzles and riddles to challenge your mind',
      icon: Brain,
      category: 'Logic',
      difficulty: 'hard',
      players: 52341,
      avgTime: '4 min',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'quick-quiz',
      title: 'Quick Quiz',
      description: 'Rapid-fire questions across multiple subjects',
      icon: Zap,
      category: 'General',
      difficulty: 'medium',
      players: 67123,
      avgTime: '2 min',
      gradient: 'from-yellow-500 to-orange-500',
      isNew: true
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Match cards and improve your memory skills',
      icon: Target,
      category: 'Memory',
      difficulty: 'easy',
      players: 41958,
      avgTime: '6 min',
      gradient: 'from-teal-500 to-blue-500'
    },
    {
      id: 'puzzle-master',
      title: 'Puzzle Master',
      description: 'Solve increasingly complex visual puzzles',
      icon: Puzzle,
      category: 'Visual',
      difficulty: 'medium',
      players: 33672,
      avgTime: '8 min',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'speed-typing',
      title: 'Speed Typing',
      description: 'Improve your typing speed and accuracy',
      icon: Timer,
      category: 'Skill',
      difficulty: 'easy',
      players: 28493,
      avgTime: '3 min',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 'science-lab',
      title: 'Science Lab',
      description: 'Conduct virtual experiments and learn science concepts',
      icon: Brain,
      category: 'Science',
      difficulty: 'hard',
      players: 22156,
      avgTime: '10 min',
      gradient: 'from-emerald-500 to-teal-500',
      isPremium: true
    },
    {
      id: 'trivia-championship',
      title: 'Trivia Championship',
      description: 'Compete in the ultimate trivia tournament',
      icon: Crown,
      category: 'Trivia',
      difficulty: 'hard',
      players: 89234,
      avgTime: '15 min',
      gradient: 'from-amber-500 to-yellow-500',
      isPremium: true
    }
  ];

  const categories = ['all', 'Math', 'Language', 'Geography', 'Logic', 'General', 'Memory', 'Visual', 'Skill', 'Science', 'Trivia'];

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'Alex Chen', score: 98740, avatar: '🏆', country: '🇺🇸' },
    { rank: 2, name: 'Maria Garcia', score: 95230, avatar: '🥈', country: '🇪🇸' },
    { rank: 3, name: 'John Smith', score: 92180, avatar: '🥉', country: '🇬🇧' },
    { rank: 4, name: 'Yuki Tanaka', score: 89760, avatar: '🎯', country: '🇯🇵' },
    { rank: 5, name: 'Emma Wilson', score: 87340, avatar: '⭐', country: '🇨🇦' }
  ];

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const startGame = (game: Game) => {
    setSelectedGame(game);
    setIsPlaying(true);
    setCurrentScore(0);
    setTimeLeft(60);
    setStreak(0);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setSelectedGame(null);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              🎮 Learning Games
            </h1>
            <p className="text-gray-600 mt-2">10 engaging games with global leaderboards</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">#{streak + 1}</p>
              <p className="text-sm text-gray-500">Current Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{currentScore}</p>
              <p className="text-sm text-gray-500">Total Score</p>
            </div>
          </div>
        </div>
      </motion.div>

      {!selectedGame ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Games Section */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All Games' : category}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group cursor-pointer"
                  onClick={() => startGame(game)}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    
                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex space-x-2">
                      {game.isNew && (
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          NEW
                        </span>
                      )}
                      {game.isPremium && (
                        <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          PRO
                        </span>
                      )}
                    </div>

                    {/* Game Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${game.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <game.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Game Info */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{game.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center bg-gray-50 rounded-lg p-2">
                        <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Players</p>
                        <p className="text-sm font-semibold text-gray-800">{game.players.toLocaleString()}</p>
                      </div>
                      <div className="text-center bg-gray-50 rounded-lg p-2">
                        <Clock className="w-4 h-4 text-green-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Avg Time</p>
                        <p className="text-sm font-semibold text-gray-800">{game.avgTime}</p>
                      </div>
                    </div>

                    {/* Difficulty & Play Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (game.difficulty === 'easy' ? 1 : game.difficulty === 'medium' ? 2 : 3)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-2 capitalize">{game.difficulty}</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`bg-gradient-to-r ${game.gradient} text-white p-2 rounded-lg hover:shadow-lg transition-all duration-300`}
                      >
                        <Play className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Global Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-800">Global Leaderboard</h3>
              </div>
              
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div key={entry.rank} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold text-sm">
                      {entry.rank}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{entry.avatar}</span>
                        <span className="font-semibold text-gray-800 text-sm">{entry.name}</span>
                        <span className="text-sm">{entry.country}</span>
                      </div>
                      <p className="text-xs text-gray-500">{entry.score.toLocaleString()} pts</p>
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                View Full Leaderboard
              </motion.button>
            </motion.div>

            {/* Today's Challenges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Medal className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800">Daily Challenges</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-800">Math Marathon</h4>
                    <Award className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-600 mb-2">Solve 50 math problems</p>
                  <div className="bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                  </div>
                  <p className="text-xs text-blue-500 mt-1">37/50 completed • +500 XP</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-800">Word Streak</h4>
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm text-green-600 mb-2">Get 10 words in a row</p>
                  <div className="bg-green-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                  </div>
                  <p className="text-xs text-green-500 mt-1">8/10 completed • +300 XP</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-purple-800">Quiz Master</h4>
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-sm text-purple-600 mb-2">Win 5 quiz games</p>
                  <div className="bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-2/5"></div>
                  </div>
                  <p className="text-xs text-purple-500 mt-1">2/5 completed • +750 XP</p>
                </div>
              </div>
            </motion.div>

            {/* Achievement Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-800">Recent Achievements</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">Speed Demon</p>
                    <p className="text-xs text-yellow-600">Completed 10 games in under 2 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-2xl">🧠</span>
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Brain Power</p>
                    <p className="text-xs text-blue-600">Solved 100 logic puzzles</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="text-sm font-semibold text-green-800">On Fire</p>
                    <p className="text-xs text-green-600">7-day playing streak</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        /* Game Playing Interface */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            
            {/* Game Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${selectedGame.gradient} rounded-xl flex items-center justify-center`}>
                  <selectedGame.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedGame.title}</h2>
                  <p className="text-gray-600">{selectedGame.description}</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopGame}
                className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Exit Game
              </motion.button>
            </div>

            {/* Game Stats */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="text-center bg-blue-50 rounded-xl p-4">
                <Timer className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Time Left</p>
                <p className="text-2xl font-bold text-blue-600">{timeLeft}s</p>
              </div>
              <div className="text-center bg-green-50 rounded-xl p-4">
                <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Score</p>
                <p className="text-2xl font-bold text-green-600">{currentScore}</p>
              </div>
              <div className="text-center bg-orange-50 rounded-xl p-4">
                <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-orange-600">{streak}</p>
              </div>
              <div className="text-center bg-purple-50 rounded-xl p-4">
                <Star className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Level</p>
                <p className="text-2xl font-bold text-purple-600">5</p>
              </div>
            </div>

            {/* Game Area */}
            <div className="bg-gray-50 rounded-2xl p-8 min-h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Gamepad2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Game Starting Soon!</h3>
                <p className="text-gray-600 mb-6">Get ready to challenge your skills in {selectedGame.title}</p>
                
                {isPlaying ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(false)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
                  >
                    <Pause className="w-5 h-5" />
                    <span>Pause Game</span>
                  </motion.button>
                ) : (
                  <div className="flex space-x-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPlaying(true)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <Play className="w-5 h-5" />
                      <span>Start Game</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCurrentScore(0);
                        setTimeLeft(60);
                        setStreak(0);
                      }}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Reset</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MiniGames;