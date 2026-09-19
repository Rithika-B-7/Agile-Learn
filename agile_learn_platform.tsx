import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit, LayoutDashboard, Route, MessageSquareCode,
  Mic, Swords, GraduationCap, LogOut, Loader2, Send,
  Plus, CheckCircle2, Circle, ChevronDown, ChevronRight, Play
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore, collection, doc, setDoc, onSnapshot,
  query, serverTimestamp, deleteDoc, updateDoc
} from 'firebase/firestore';

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
let app, auth, db;
try {
  if (Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Firebase init error:", error);
}

const appId = typeof __app_id !== 'undefined' ? __app_id : 'agile-learn-dev';

const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');

:root {
  --bg-color: hsl(260, 87%, 3%);
  --fg-color: hsl(40, 6%, 95%);
  --hero-sub: hsl(40, 6%, 82%);
  --primary: #4f46e5;
  --secondary: #9333ea;
  --accent: #f59e0b;
}

body {
  background-color: var(--bg-color);
  color: var(--fg-color);
  font-family: 'Geist Sans', system-ui, sans-serif;
  margin: 0;
  overflow-x: hidden;
}

.font-headline { font-family: 'General Sans', sans-serif; }
.font-space { font-family: 'Space Grotesk', sans-serif; }

.text-gradient {
  background-image: linear-gradient(to left, #6366f1, #a855f7, #fcd34d);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.liquid-glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
}

@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 20s linear infinite;
}

/* Scrollbar styling for a cleaner look */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }

/* Markdown styling for AI responses */
.prose pre { background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-top: 0.5rem; margin-bottom: 0.5rem; }
.prose code { color: #fcd34d; font-family: monospace; }
`;

const generateAIResponse = async (prompt, systemPrompt, useJSON = false) => {
  const apiKey = ""; // Leave blank, runtime will provide
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] }
  };

  if (useJSON) {
    payload.generationConfig = {
      responseMimeType: "application/json"
    };
  }

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("API Request Failed");
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return useJSON ? "[]" : "Error connecting to AI. Please try again.";
  }
};

const LandingPage = ({ onStart }) => {
  const videoRef = useRef(null);

  // Video looping and fade logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let fadeReq;
    const fadeDuration = 0.5; // seconds

    const handleTimeUpdate = () => {
      const timeLeft = video.duration - video.currentTime;
      if (video.currentTime < fadeDuration) {
        video.style.opacity = video.currentTime / fadeDuration;
      } else if (timeLeft < fadeDuration) {
        video.style.opacity = timeLeft / fadeDuration;
      } else {
        video.style.opacity = 1;
      }
    };

    const handleEnded = () => {
      video.style.opacity = 0;
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 100);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const features = ["Adaptive Logic", "Voice Tutor", "Code Mentor", "Dynamic Trees", "RPG Progression", "Live Analytics"];
  // Duplicate for seamless marquee
  const marqueeItems = [...features, ...features];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[var(--bg-color)]">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4"
          autoPlay muted playsInline
          className="w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: 0 }}
        />
        {/* Glow behind content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[984px] h-[527px] opacity-80 bg-black/50 blur-[82px] pointer-events-none rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full py-5 px-8 flex justify-between items-center bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2 text-xl font-bold font-space">
          <BrainCircuit className="text-[var(--accent)]" />
          <span>Agile Learn</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[var(--fg-color)]/90">
          <button className="hover:text-white transition flex items-center gap-1">Features <ChevronDown size={16} /></button>
          <button className="hover:text-white transition">Solutions</button>
          <button className="hover:text-white transition">Plans</button>
          <button className="hover:text-white transition flex items-center gap-1">Learning <ChevronDown size={16} /></button>
        </div>
        <button
          onClick={onStart}
          className="bg-[var(--fg-color)] text-[var(--bg-color)] px-6 py-2 rounded-full font-semibold hover:bg-white transition"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 mt-[-50px]">
        <h1 className="font-headline font-medium text-[120px] md:text-[220px] leading-[0.9] tracking-[-0.024em] select-none">
          <span className="text-[var(--fg-color)] block md:inline">Agile </span>
          <span className="text-gradient">Learn</span>
        </h1>
        <p className="text-[var(--hero-sub)] text-lg md:text-xl leading-8 mt-6 max-w-xl mx-auto font-medium opacity-80">
          The most powerful AI ever deployed in personalized learning.
        </p>
        <button
          onClick={onStart}
          className="liquid-glass text-white px-8 py-4 mt-10 rounded-full font-bold text-lg hover:bg-white/10 transition flex items-center gap-2 group"
        >
          Start Learning Journey <ChevronRight className="group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* Marquee Footer */}
      <div className="relative z-10 w-full pb-10 overflow-hidden">
        <div className="max-w-6xl mx-auto flex items-center gap-12 px-8">
          <p className="text-[var(--fg-color)]/50 text-sm whitespace-nowrap hidden md:block">
            Advanced features <br /> engineered for you
          </p>
          <div className="flex-1 overflow-hidden mask-edges">
            <div className="animate-marquee flex gap-12 items-center">
              {marqueeItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 liquid-glass px-4 py-2">
                  <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-sm font-bold text-[var(--accent)]">
                    {item.charAt(0)}
                  </div>
                  <span className="text-base font-semibold text-white whitespace-nowrap">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Layout for Dashboard Pages
const PageHeader = ({ title, subtitle, icon: Icon }) => (
  <div className="mb-8 border-b border-white/10 pb-6">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-[var(--primary)]/20 rounded-lg text-[var(--primary)]">
        <Icon size={24} />
      </div>
      <h1 className="text-3xl font-bold font-space">{title}</h1>
    </div>
    <p className="text-[var(--fg-color)]/60 text-lg">{subtitle}</p>
  </div>
);

const CurriculumKanban = ({ userId }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [sprints, setSprints] = useState([]);

  // Fetch sprints from Firebase
  useEffect(() => {
    if (!userId || !db) return;
    const q = query(collection(db, 'artifacts', appId, 'users', userId, 'sprints'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSprints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by order
      setSprints(fetchedSprints.sort((a, b) => a.order - b.order));
    }, (error) => console.error("Firebase listen error:", error));
    return () => unsubscribe();
  }, [userId]);

  const generatePath = async (e) => {
    e.preventDefault();
    if (!topic || !userId || !db) return;
    setLoading(true);
    
    const sysPrompt = `You are a curriculum designer. The user wants to learn: ${topic}. 
    Generate a 3-sprint agile learning path.
    Return strictly a JSON array of objects.
    Schema: [{ "title": "Sprint 1: Basics", "description": "Core concepts", "status": "todo" }]`;
    
    const res = await generateAIResponse(`Create a path for ${topic}`, sysPrompt, true);
    
    try {
      const data = JSON.parse(res);
      // Clear old sprints (simplified for demo)
      for (const sprint of sprints) {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', userId, 'sprints', sprint.id));
      }
      // Add new ones
      for (let i = 0; i < data.length; i++) {
        const docRef = doc(collection(db, 'artifacts', appId, 'users', userId, 'sprints'));
        await setDoc(docRef, { ...data[i], order: i, status: 'todo', createdAt: serverTimestamp() });
      }
      setTopic('');
    } catch (err) {
      console.error("Failed to parse JSON", err);
    }
    setLoading(false);
  };

  const updateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'todo' ? 'in-progress' : currentStatus === 'in-progress' ? 'done' : 'todo';
    if(db) await updateDoc(doc(db, 'artifacts', appId, 'users', userId, 'sprints', id), { status: nextStatus });
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="Adaptive Sprints" subtitle="AI-generated Kanban boards for your learning goals." icon={Route} />
      
      <form onSubmit={generatePath} className="flex gap-4 mb-8">
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What do you want to master next? (e.g. React Hooks, System Design)" 
          className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)]"
          required
        />
        <button 
          disabled={loading}
          className="bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white px-8 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Plus />} Generate Path
        </button>
      </form>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
        {['todo', 'in-progress', 'done'].map(colStatus => (
          <div key={colStatus} className="liquid-glass p-4 flex flex-col gap-4">
            <h3 className="font-bold text-lg capitalize border-b border-white/10 pb-2">{colStatus.replace('-', ' ')}</h3>
            <div className="flex flex-col gap-3">
              {sprints.filter(s => s.status === colStatus).map(sprint => (
                <div key={sprint.id} className="bg-black/40 border border-white/10 p-4 rounded-lg group">
                  <h4 className="font-bold mb-1">{sprint.title}</h4>
                  <p className="text-sm text-gray-400 mb-3">{sprint.description}</p>
                  <button 
                    onClick={() => updateStatus(sprint.id, colStatus)}
                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded w-full flex justify-between items-center"
                  >
                    Move Ticket <ChevronRight size={14} />
                  </button>
                </div>
              ))}
              {sprints.filter(s => s.status === colStatus).length === 0 && (
                <div className="text-center text-white/30 text-sm py-4 italic">No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CodeMentor = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your AI Code Mentor. Paste your code or ask a technical question, and I'll review it like a senior engineer." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMsgs = [...messages, { role: 'user', text: input }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    const sysPrompt = "Act as a Senior Software Engineer acting as a mentor. Review the code or answer the question. Be concise, point out architecture flaws, and provide small code snippets for correction. Use Markdown.";
    const fullPrompt = newMsgs.map(m => `${m.role === 'user' ? 'User' : 'Mentor'}: ${m.text}`).join('\n') + `\nMentor:`;
    
    const res = await generateAIResponse(fullPrompt, sysPrompt);
    setMessages([...newMsgs, { role: 'ai', text: res }]);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="AI Code Mentor" subtitle="Real-time architecture and code reviews." icon={MessageSquareCode} />
      
      <div className="flex-1 liquid-glass rounded-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-[var(--primary)] text-white' : 'bg-black/40 border border-white/10'}`}>
                <div className="text-xs opacity-50 mb-1 uppercase font-bold tracking-wider">{msg.role === 'user' ? 'You' : 'Mentor'}</div>
                <div className="prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>').replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center gap-2">
                 <Loader2 className="animate-spin" size={16} /> <span className="text-sm">Reviewing code...</span>
               </div>
             </div>
          )}
          <div ref={endRef} />
        </div>
        
        <form onSubmit={sendMessage} className="p-4 bg-black/40 border-t border-white/10 flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste code or ask a question..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--primary)] font-mono text-sm"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white px-6 rounded-lg flex items-center justify-center disabled:opacity-50 transition"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

const VoiceTutor = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('Press the microphone to start our Socratic discussion.');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fallback Web Speech API implementations
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Your browser doesn't support the Web Speech API. Try Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => { setIsListening(true); setTranscript(''); };
    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
      processVoiceCommand(text);
    };
    recognition.onerror = (e) => { console.error(e); setIsListening(false); };
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const processVoiceCommand = async (text) => {
    setResponse("Thinking...");
    const sysPrompt = "You are a strict Socratic tutor. DO NOT give the user the direct answer. Ask probing, critical thinking questions to lead them to the answer themselves based on their input. Keep it under 3 sentences so it can be spoken aloud easily.";
    
    const reply = await generateAIResponse(text, sysPrompt);
    setResponse(reply);
    speakResponse(reply);
  };

  const speakResponse = (text) => {
    if (!synth) return;
    synth.cancel(); // cancel current speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good English voice
    const voices = synth.getVoices();
    const goodVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US'));
    if (goodVoice) utterance.voice = goodVoice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synth.speak(utterance);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
       <PageHeader title="Socratic Voice Tutor" subtitle="Talk through problems. I won't give you answers; I'll help you find them." icon={Mic} />
       
       <div className={`relative mb-12 transition-all duration-500 ${isSpeaking ? 'scale-110' : ''}`}>
         <div className={`absolute inset-0 rounded-full bg-[var(--primary)] blur-3xl opacity-20 ${isListening || isSpeaking ? 'animate-pulse' : ''}`} />
         <button 
           onClick={startListening}
           className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center border-4 ${isListening ? 'border-red-500 bg-red-500/20 text-red-500' : 'border-[var(--primary)] bg-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/30'} transition-colors`}
         >
           <Mic size={48} />
         </button>
       </div>

       <div className="w-full liquid-glass p-8 min-h-[200px] flex flex-col justify-center gap-6">
         {transcript && (
           <div className="text-white/50 italic border-b border-white/10 pb-4">
             " {transcript} "
           </div>
         )}
         <div className="text-xl font-medium leading-relaxed font-headline">
           {response}
         </div>
       </div>
    </div>
  );
};

const QuizArena = () => {
  const [topic, setTopic] = useState('JavaScript Basics');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hp, setHp] = useState(100);
  const [xp, setXp] = useState(0);

  const generateBattle = async () => {
    setLoading(true);
    const sysPrompt = `Generate a single, moderately difficult multiple-choice programming question about ${topic}. 
    Return strictly JSON: { "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "..." }`;
    
    const res = await generateAIResponse(`Create question for ${topic}`, sysPrompt, true);
    try {
      setQuiz(JSON.parse(res));
    } catch (e) {
      console.error(e);
      alert("Failed to generate encounter.");
    }
    setLoading(false);
  };

  const handleAnswer = (index) => {
    if (index === quiz.correctIndex) {
      setXp(xp + 50);
      alert("Critical Hit! +50 XP\n\n" + quiz.explanation);
      setQuiz(null); // Clear for next battle
    } else {
      setHp(Math.max(0, hp - 25));
      alert("Miss! Took 25 DMG.\n\n" + quiz.explanation);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader title="Quiz Arena" subtitle="Verbal boss battles and technical challenges." icon={Swords} />
      
      {/* Stats Bar */}
      <div className="flex gap-6 mb-8 liquid-glass p-4">
        <div className="flex-1">
          <div className="flex justify-between mb-1 text-sm font-bold text-red-400"><span>HP</span> <span>{hp}/100</span></div>
          <div className="h-4 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-red-500 transition-all" style={{ width: `${hp}%` }}/></div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between mb-1 text-sm font-bold text-yellow-400"><span>XP</span> <span>{xp}</span></div>
          <div className="h-4 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 transition-all" style={{ width: `${(xp % 1000) / 10}%` }}/></div>
        </div>
      </div>

      {!quiz ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center liquid-glass p-8">
          <Swords size={64} className="text-white/20 mb-6" />
          <h2 className="text-2xl font-bold mb-4">Ready for an Encounter?</h2>
          <input 
            type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 mb-4 text-center"
          />
          <button onClick={generateBattle} disabled={loading || hp <= 0} className="bg-[var(--accent)] text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50">
            {loading ? 'Summoning Boss...' : hp <= 0 ? 'Game Over - Heal Up!' : 'Enter Arena'}
          </button>
        </div>
      ) : (
        <div className="flex-1 liquid-glass p-8 flex flex-col">
          <h2 className="text-2xl font-medium font-headline mb-8 text-center">{quiz.question}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
            {quiz.options.map((opt, i) => (
              <button 
                key={i} onClick={() => handleAnswer(i)}
                className="bg-black/40 hover:bg-[var(--primary)]/20 border border-white/10 p-6 rounded-xl text-left transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('kanban');
  const [user, setUser] = useState(null);

  // Initialize Anonymous Firebase Auth for persistence
  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });
    // Inject global styles dynamically
    const styleEl = document.createElement('style');
    styleEl.innerHTML = globalStyles;
    document.head.appendChild(styleEl);

    return () => { unsub(); document.head.removeChild(styleEl); };
  }, []);

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  const tabs = [
    { id: 'kanban', icon: Route, label: 'Curriculum' },
    { id: 'mentor', icon: MessageSquareCode, label: 'Code Mentor' },
    { id: 'tutor', icon: Mic, label: 'Voice Tutor' },
    { id: 'arena', icon: Swords, label: 'Quiz Arena' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--fg-color)] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 flex flex-col bg-black/20">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <BrainCircuit className="text-[var(--accent)]" />
          <span className="font-space font-bold text-xl">Agile Learn</span>
        </div>
        
        {/* User Profile Hook */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center font-bold">
             R
           </div>
           <div>
             <div className="font-bold text-sm">Rishi Ram M</div>
             <div className="text-xs text-white/50">Level 42 Developer</div>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[var(--primary)] text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <Icon size={20} /> {tab.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => setStarted(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:bg-white/5 hover:text-red-400 transition-colors">
            <LogOut size={20} /> Exit Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto h-full">
          {activeTab === 'kanban' && <CurriculumKanban userId={user?.uid} />}
          {activeTab === 'mentor' && <CodeMentor />}
          {activeTab === 'tutor' && <VoiceTutor />}
          {activeTab === 'arena' && <QuizArena />}
        </div>
      </main>
    </div>
  );
}