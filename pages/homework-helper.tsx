import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, Upload, Brain, Lightbulb, CheckCircle, 
  BookOpen, Calculator, Flask, Globe, Microscope,
  History, Share2, Download, Zap, Image as ImageIcon,
  FileText, MessageCircle, Star, Clock
} from 'lucide-react';

interface Solution {
  id: string;
  problem: string;
  subject: string;
  solution: string;
  steps: string[];
  confidence: number;
  timestamp: Date;
  difficulty: 'easy' | 'medium' | 'hard';
}

const HomeworkHelper = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'camera' | 'upload'>('camera');
  const [selectedSubject, setSelectedSubject] = useState('auto');
  const [recentSolutions, setRecentSolutions] = useState<Solution[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const subjects = [
    { id: 'auto', name: 'Auto-Detect', icon: Brain, color: 'from-purple-500 to-pink-500' },
    { id: 'math', name: 'Mathematics', icon: Calculator, color: 'from-blue-500 to-cyan-500' },
    { id: 'physics', name: 'Physics', icon: Zap, color: 'from-yellow-500 to-orange-500' },
    { id: 'chemistry', name: 'Chemistry', icon: Flask, color: 'from-green-500 to-emerald-500' },
    { id: 'biology', name: 'Biology', icon: Microscope, color: 'from-teal-500 to-blue-500' },
    { id: 'geography', name: 'Geography', icon: Globe, color: 'from-indigo-500 to-purple-500' }
  ];

  const handleFileUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const analyzeProblem = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock solution data
    const mockSolution: Solution = {
      id: Date.now().toString(),
      problem: "Solve for x: 2x + 5 = 13",
      subject: selectedSubject === 'auto' ? 'math' : selectedSubject,
      solution: "x = 4",
      steps: [
        "Start with the equation: 2x + 5 = 13",
        "Subtract 5 from both sides: 2x = 13 - 5",
        "Simplify the right side: 2x = 8",
        "Divide both sides by 2: x = 8 ÷ 2",
        "Final answer: x = 4"
      ],
      confidence: 95,
      timestamp: new Date(),
      difficulty: 'medium'
    };
    
    setSolution(mockSolution);
    setRecentSolutions(prev => [mockSolution, ...prev.slice(0, 4)]);
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setSolution(null);
  };

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              📸 Homework Solver
            </h1>
            <p className="text-gray-600 mt-2">Take photos and get instant AI-powered solutions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">95%</p>
              <p className="text-sm text-gray-500">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">2.3M+</p>
              <p className="text-sm text-gray-500">Problems Solved</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Upload Area */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
          >
            
            {/* Subject Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Subject</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <motion.button
                    key={subject.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      selectedSubject === subject.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${subject.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <subject.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">{subject.name}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Upload Methods */}
            <div className="mb-6">
              <div className="flex space-x-4 mb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUploadMethod('camera')}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all duration-300 ${
                    uploadMethod === 'camera'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Camera className="w-5 h-5 mx-auto mb-2" />
                  <p className="text-sm font-medium">Camera</p>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUploadMethod('upload')}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all duration-300 ${
                    uploadMethod === 'upload'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Upload className="w-5 h-5 mx-auto mb-2" />
                  <p className="text-sm font-medium">Upload</p>
                </motion.button>
              </div>
            </div>

            {/* Image Upload Area */}
            {!selectedImage ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-gray-400 transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {uploadMethod === 'camera' ? 'Take a Photo' : 'Upload an Image'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {uploadMethod === 'camera' 
                    ? 'Capture your homework problem with your camera'
                    : 'Drop an image here or click to browse'
                  }
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={uploadMethod === 'camera' ? handleCameraCapture : handleFileSelect}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    {uploadMethod === 'camera' ? 'Open Camera' : 'Choose File'}
                  </motion.button>
                </div>

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageInput}
                  className="hidden"
                />
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageInput}
                  className="hidden"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Image Preview */}
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Uploaded problem"
                    className="w-full max-h-96 object-contain rounded-xl shadow-lg"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetAnalysis}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </motion.button>
                </div>

                {/* Analyze Button */}
                {!solution && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={analyzeProblem}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing Problem...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        <span>Solve with AI</span>
                      </>
                    )}
                  </motion.button>
                )}

                {/* Solution Display */}
                {solution && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-800">Solution Found!</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-600">{solution.confidence}% confident</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Problem:</p>
                        <p className="text-gray-800">{solution.problem}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Final Answer:</p>
                        <p className="text-2xl font-bold text-green-600">{solution.solution}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Step-by-Step Solution:</p>
                        <ol className="space-y-2">
                          {solution.steps.map((step, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <span className="bg-blue-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Ask Follow-up</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Recent Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-2 mb-4">
              <History className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Recent Solutions</h3>
            </div>
            
            {recentSolutions.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent solutions yet</p>
            ) : (
              <div className="space-y-3">
                {recentSolutions.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.problem}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.subject} • {item.difficulty}
                        </p>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-800">Tips for Better Results</h3>
            </div>
            
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Ensure good lighting and clear text</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Hold camera steady and focus</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Include the complete problem</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Select correct subject for better accuracy</span>
              </li>
            </ul>
          </motion.div>

          {/* Subjects Supported */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">Subjects Supported</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {subjects.slice(1).map((subject) => (
                <div key={subject.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className={`w-6 h-6 bg-gradient-to-r ${subject.color} rounded-md flex items-center justify-center`}>
                    <subject.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomeworkHelper;