import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Plus, Activity, Heart, Trophy, Calendar, Sparkles, Users, BookOpen, AlertCircle,
    Lightbulb, Search, Star, MessageSquare, Clock, MapPin, Check, ArrowUpRight, Home, Badge
} from 'lucide-react';
import { usePersona } from '../contexts/PersonaContext';

const EngagementCulture: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showKudosForm, setShowKudosForm] = useState(false);
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [showIdeaModal, setShowIdeaModal] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [isRSVPed, setIsRSVPed] = useState(false);
    const navigate = useNavigate();

    const { role } = usePersona();
    const isHR = role === 'HR_ADMIN';

    const [kudosFilter, setKudosFilter] = useState('All');
    const [reactionPicker, setReactionPicker] = useState<number | null>(null);
    const [expandedComments, setExpandedComments] = useState<number | null>(null);
    const [commentText, setCommentText] = useState("");
    const [sharedId, setSharedId] = useState<number | null>(null);

    const [formRecipient, setFormRecipient] = useState("");
    const [formCategory, setFormCategory] = useState("");
    const [formMessage, setFormMessage] = useState("");

    // Club Request Form State
    const [showClubModal, setShowClubModal] = useState(false);
    const [newClubName, setNewClubName] = useState("");
    const [newClubActivity, setNewClubActivity] = useState("");

    // Badge Config State
    const [isCustomBadge, setIsCustomBadge] = useState(false);
    const [customBadgeTitle, setCustomBadgeTitle] = useState("");
    const [customBadgeIcon, setCustomBadgeIcon] = useState("⭐");
    const [selectedBadge, setSelectedBadge] = useState<number | null>(null);

    // Idea Submission State
    const [ideaTitle, setIdeaTitle] = useState("");
    const [ideaDesc, setIdeaDesc] = useState("");

    // Leaderboard State
    const [showAllStaff, setShowAllStaff] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);

    const [joinedClubs, setJoinedClubs] = useState<string[]>([]);

    interface KudosItem {
        id: number;
        to: string;
        from: string;
        type: string;
        content: string;
        time: string;
        likes: number;
        reactions: Record<string, number>;
        comments: { user: string; text: string }[];
        date: string;
    }

    const [kudosList, setKudosList] = useState<KudosItem[]>([
        { id: 1, to: "Ms. Reshma Binu Prasad", from: "Ms. Sanchaiyata Majumdar", type: "Mentorship", content: "Thank you for guiding the junior faculty through the accreditation process. Your leadership was invaluable!", time: "2h ago", likes: 12, reactions: { heart: 5, clap: 3, smile: 2, fire: 1 }, comments: [{ user: "Dr. R Sedhunivas", text: "Truly inspiring leadership!" }], date: "Feb 14" },
        { id: 2, to: "Admin Team", from: "Campus Director", type: "Innovation", content: "Great job streamlining the student enrollment system. Efficiency at its best!", time: "4h ago", likes: 24, reactions: { heart: 10, clap: 8, fire: 6 }, comments: [], date: "Feb 13" },
        { id: 3, to: "Dr. Ranjita Saikia", from: "Student Council", type: "Team Player", content: "Appreciate the extra hours spent organizing the cultural fest. It was a huge success!", time: "1d ago", likes: 45, reactions: { heart: 20, clap: 15, celebrate: 10 }, comments: [], date: "Feb 12" },
        { id: 4, to: "Dr. R Sedhunivas", from: "Research Dept", type: "Excellence", content: "Congratulations on your published paper in Nature! Breaking new ground.", time: "2d ago", likes: 89, reactions: { heart: 40, star: 20, fire: 29 }, comments: [], date: "Feb 10" },
    ]);

    const [activitiesList, setActivitiesList] = useState([
        { id: 1, title: 'Annual Sports Day', date: 'March 15, 2024', type: 'Community', rsvp: 120, location: 'Main Ground' },
        { id: 2, title: 'Research Symposium', date: 'April 05, 2024', type: 'Academic', rsvp: 85, location: 'Auditorium' },
        { id: 3, title: 'Health & Wellness Camp', date: 'March 22, 2024', type: 'Wellness', rsvp: 45, location: 'Health Center' },
    ]);

    const [valuesList, setValuesList] = useState([
        { id: 1, title: 'Student Centricity', content: "Every decision we make puts the student's growth and well-being at the core.", author: 'Ms. Reshma Binu Prasad', date: 'Core Value #01', image: true },
        { id: 2, title: 'Innovation', content: 'We constantly challenge the status quo to improve learning outcomes.', author: 'Ms. Sanchaiyata Majumdar', date: 'Core Value #02', image: false },
        { id: 3, title: 'Inclusivity', content: 'Diversity is our strength. We foster a welcoming environment for all.', author: 'Dr. R Sedhunivas', date: 'Core Value #03', image: false },
    ]);

    const [ideasList, setIdeasList] = useState([
        { id: 1, title: 'Digital Campus Navigation App', votes: 156, author: 'Student Council', status: 'Under Review' },
        { id: 2, title: 'Sustainable Solar Roofing', votes: 89, author: 'Engineering Dept', status: 'Implemented' },
        { id: 3, title: 'AI-Driven Library Assistant', votes: 42, author: 'CS Faculty', status: 'Voting' },
    ]);

    const [clubsList, setClubsList] = useState([
        { id: 1, name: 'Institutional Sports Club', members: 42, activity: 'Indoor Badminton', icon: Users, color: 'text-violet-500', bg: 'bg-violet-50', status: 'Approved' },
        { id: 2, name: 'Literary Society', members: 18, activity: 'Book Review', icon: BookOpen, color: 'text-pink-500', bg: 'bg-pink-50', status: 'Approved' },
        { id: 3, name: 'Tech Innovators', members: 35, activity: 'Hackathon Prep', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50', status: 'Approved' },
        { id: 4, name: 'Wellness Circle', members: 24, activity: 'Yoga & Meditation', icon: Heart, color: 'text-emerald-500', bg: 'bg-emerald-50', status: 'Approved' },
    ]);

    const [eduBadges, setEduBadges] = useState([
        { id: 1, label: 'Research', icon: BookOpen, color: 'bg-blue-500', level: 'Silver' },
        { id: 2, label: 'Mentor', icon: Users, color: 'bg-indigo-500', level: 'Gold' },
        { id: 3, label: 'Innovation', icon: Lightbulb, color: 'bg-amber-500', level: 'Silver' },
        { id: 4, label: 'Community', icon: Heart, color: 'bg-rose-500', level: 'Bronze' },
        { id: 5, label: 'Leader', icon: Trophy, color: 'bg-emerald-500', level: 'Gold' },
        { id: 6, label: 'Veteran', icon: Star, color: 'bg-purple-500', level: 'Gold' },
    ]);

    const staffList = [
        { rank: 1, name: "Ms. Reshma Binu Prasad", points: 2450, avatar: "RBP", badges: ["Innovation", "Leadership", "Mentor", "Research"] },
        { rank: 2, name: "Ms. Sanchaiyata Majumdar", points: 2100, avatar: "SM", badges: ["Excellence", "Team Player", "Veteran"] },
        { rank: 3, name: "Dr. R Sedhunivas", points: 1950, avatar: "RS", badges: ["Rising Star", "Community"] },
        { rank: 4, name: "Dr. Ranjita Saikia", points: 1800, avatar: "RS", badges: ["Organizer", "Dedication"] },
        { rank: 5, name: "Mr. Manjit Singh", points: 1750, avatar: "MS", badges: ["Visionary"] },
        { rank: 6, name: "Mr. Edwin Vimal A", points: 1600, avatar: "EVA", badges: ["Pioneer"] },
    ];

    const categoryThemes: Record<string, { bg: string, border: string, accent: string, light: string }> = {
        'Mentorship': { bg: 'bg-indigo-50', border: 'border-indigo-100', accent: 'text-indigo-600', light: 'bg-indigo-100' },
        'Innovation': { bg: 'bg-amber-50', border: 'border-amber-100', accent: 'text-amber-600', light: 'bg-amber-100' },
        'Team Player': { bg: 'bg-emerald-50', border: 'border-emerald-100', accent: 'text-emerald-600', light: 'bg-emerald-100' },
        'Excellence': { bg: 'bg-rose-50', border: 'border-rose-100', accent: 'text-rose-600', light: 'bg-rose-100' },
        'default': { bg: 'bg-slate-50', border: 'border-slate-100', accent: 'text-slate-600', light: 'bg-slate-100' }
    };

    const handleVote = (id: number) => {
        setIdeasList(ideasList.map(idea => idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea));
    };

    const handleReaction = (id: number, emoji: string) => {
        setKudosList(kudosList.map(item => {
            if (item.id === id) {
                const currentCount = item.reactions[emoji as keyof typeof item.reactions] || 0;
                return {
                    ...item,
                    reactions: { ...item.reactions, [emoji]: currentCount + 1 }
                };
            }
            return item;
        }));
        setReactionPicker(null);
    };

    const handleAddComment = (id: number) => {
        if (!commentText.trim()) return;
        setKudosList(kudosList.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    comments: [...item.comments, { user: "You", text: commentText }]
                };
            }
            return item;
        }));
        setCommentText("");
    };


    const handleAddKudos = () => {
        if (!formRecipient || !formMessage || !formCategory) return;
        const newKudos: KudosItem = {
            id: Date.now(),
            to: formRecipient,
            from: "You",
            type: formCategory,
            content: formMessage,
            time: "Just now",
            likes: 0,
            reactions: {},
            comments: [],
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
        setKudosList([newKudos, ...kudosList]);
        setShowKudosForm(false);
        setFormRecipient("");
        setFormMessage("");
        setFormCategory("");
    };

    const handleCreateClub = () => {
        if (!newClubName) return;

        const newClub = {
            id: Date.now(),
            name: newClubName,
            members: 1,
            activity: newClubActivity || "To be defined",
            icon: Users,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50',
            status: isHR ? 'Approved' : 'Pending'
        };

        setClubsList([newClub, ...clubsList]);
        setShowClubModal(false);
        setNewClubName("");
        setNewClubActivity("");

        if (isHR) {
            alert(`Club "${newClubName}" has been created and auto-approved.`);
        } else {
            alert(`Club request for "${newClubName}" submitted for HR approval!`);
        }
    };

    const handleApproveClub = (id: number) => {
        setClubsList(clubsList.map(club => club.id === id ? { ...club, status: 'Approved' } : club));
    };

    const handleDelete = (listName: string, id: number) => {
        if (confirm('Are you sure you want to delete this item?')) {
            if (listName === 'ideas') setIdeasList(ideasList.filter(i => i.id !== id));
            if (listName === 'activities') setActivitiesList(activitiesList.filter(a => a.id !== id));
            if (listName === 'values') setValuesList(valuesList.filter(v => v.id !== id));
        }
    };

    const subModules = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'kudos', label: 'Recognition', icon: Trophy },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'clubs', label: 'Clubs', icon: Users },
        { id: 'wellness', label: 'Wellness', icon: Activity },
        { id: 'ideas', label: 'Ideas', icon: Lightbulb },
        { id: 'badges', label: 'Badges', icon: Badge },
        { id: 'values', label: 'Values', icon: Heart },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-10 font-sans text-slate-900">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                            <Heart className="w-8 h-8 text-white" />
                        </div>
                        <span className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest">
                            Campuse Life & Vibe
                        </span>
                    </div>
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-2">
                            Engagement & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Culture</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            Foster a thriving community through recognition, events, and shared values.
                        </p>
                    </div>
                </div>

                {isHR && (
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-xs gap-2"
                        >
                            <Home className="w-4 h-4" /> Home
                        </Button>
                        <Button
                            onClick={() => setShowKudosForm(true)}
                            className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-6 h-12 font-black shadow-xl shadow-slate-200 uppercase tracking-widest text-xs gap-2"
                        >
                            <Trophy className="w-4 h-4" /> Give Kudos
                        </Button>
                        <Button
                            onClick={() => setShowAnalytics(true)}
                            className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-xs gap-2"
                        >
                            <Activity className="w-4 h-4" /> View Analytics
                        </Button>
                    </div>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200 sticky top-0 bg-slate-50/95 backdrop-blur-sm z-30 pt-2">
                {subModules.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id
                            ? 'bg-slate-900 text-white shadow-lg scale-105'
                            : 'bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-400' : ''}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <main className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                {activeTab === 'overview' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Welcome Card */}
                        <Card className="col-span-full lg:col-span-2 rounded-[48px] p-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/15 transition-all duration-1000" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-indigo-100 text-[10px] font-black uppercase tracking-widest mb-6">
                                    Today's Vibe Check
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tighter">
                                    "Culture is typically <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-200">what we do </span>
                                    when no one is looking."
                                </h2>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">Community Quote</p>
                                        <p className="text-indigo-200 text-sm font-medium">Shared by Ms. Reshma Binu Prasad</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Stats */}
                        <div className="space-y-6">
                            <Card className="rounded-[40px] p-8 bg-white border-slate-100 shadow-xl shadow-slate-50 flex items-center justify-between group hover:border-indigo-100 transition-all">
                                <div>
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Kudos Given</p>
                                    <h3 className="text-4xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">1,248</h3>
                                </div>
                                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                    <Trophy className="w-8 h-8" />
                                </div>
                            </Card>
                            <Card className="rounded-[40px] p-8 bg-white border-slate-100 shadow-xl shadow-slate-50 flex items-center justify-between group hover:border-emerald-100 transition-all">
                                <div>
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Upcoming Events</p>
                                    <h3 className="text-4xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">8</h3>
                                </div>
                                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                    <Calendar className="w-8 h-8" />
                                </div>
                            </Card>
                        </div>

                        {/* Recent Kudos Feed (Mini) */}
                        <div className="col-span-full py-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Recent Shoutouts</h3>
                                <button
                                    onClick={() => setActiveTab('kudos')}
                                    className="px-6 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-black text-xs uppercase tracking-widest transition-colors"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {kudosList.slice(0, 4).map((item) => (
                                    <div key={item.id} className="p-6 rounded-[32px] bg-white border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.type === 'Mentorship' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'} `}>
                                                {item.type}
                                            </div>
                                            <Heart className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-colors" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 mb-1">To: {item.to}</p>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">"{item.content}"</p>
                                        <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                                            <div className="w-6 h-6 rounded-full bg-slate-200" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From: You</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Events Preview */}
                    </div>
                ) : activeTab === 'wellness' ? (
                    <div className="flex items-center justify-center min-h-[400px] bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-50 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 opacity-50" />
                        <div className="relative z-10 text-center space-y-6 max-w-md p-8">
                            <div className="w-20 h-20 rounded-3xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto animate-bounce">
                                <Activity className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Coming Soon</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    We are working to improve the experience. Enhanced wellness tracking, support groups, and mental health resources are on the way!
                                </p>
                            </div>
                            <div className="pt-4">
                                <span className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                                    Under Development
                                </span>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'clubs' ? (
                    <div className="space-y-8">
                        <div className="flex items-center justify-end">
                            <Button
                                onClick={() => setShowClubModal(true)}
                                className="bg-violet-600 hover:bg-violet-700 text-white rounded-2xl h-12 px-6 font-black shadow-lg shadow-violet-200 gap-2"
                            >
                                <Plus className="w-4 h-4" /> Request New Club
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {clubsList.map((club) => {
                                const isJoined = joinedClubs.includes(club.name);
                                const isPending = club.status === 'Pending';
                                return (
                                    <Card key={club.id} className="rounded-[40px] p-6 bg-white border-slate-100 shadow-xl shadow-slate-50 hover:border-indigo-200 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden">
                                        {isPending && (
                                            <div className="absolute top-0 right-0 p-4">
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                    Pending HR Review
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={`w-14 h-14 rounded-2xl ${club.bg} flex items-center justify-center ${club.color}`}>
                                                <club.icon className="w-7 h-7" />
                                            </div>
                                            <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {club.members}
                                            </span>
                                        </div>
                                        <div className="space-y-2 mb-6 flex-1">
                                            <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tighter">{club.name}</h3>
                                            <p className="text-sm font-medium text-slate-500 leading-relaxed">{club.activity}</p>
                                        </div>
                                        <div className="space-y-2 mt-auto">
                                            {isHR && isPending ? (
                                                <Button
                                                    onClick={() => handleApproveClub(club.id)}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 font-black uppercase tracking-widest text-[10px]"
                                                >
                                                    Approve Club Request
                                                </Button>
                                            ) : isJoined ? (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button variant="outline" className="w-full text-indigo-600 font-bold border-indigo-100 hover:bg-indigo-50 rounded-xl gap-2 text-xs">
                                                        <MessageSquare className="w-3 h-3" /> Chat
                                                    </Button>
                                                    <Button variant="outline" className="w-full text-indigo-600 font-bold border-indigo-100 hover:bg-indigo-50 rounded-xl gap-2 text-xs">
                                                        <Calendar className="w-3 h-3" /> Event
                                                    </Button>
                                                </div>
                                            ) : !isPending && (
                                                <Button
                                                    onClick={() => setJoinedClubs([...joinedClubs, club.name])}
                                                    variant="ghost"
                                                    className="w-full text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 rounded-xl"
                                                >
                                                    Join Club
                                                </Button>
                                            )}
                                            {isPending && !isHR && (
                                                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic py-2">Approval Pending</p>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ) : activeTab === 'badges' ? (
                    <div className="space-y-8">
                        <Card className="rounded-[40px] p-8 border-none bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                        <Badge className="w-8 h-8 text-yellow-400" />
                                        Badges & Gamification
                                    </h3>
                                    <p className="text-slate-400 font-medium max-w-xl">
                                        Configure digital badges to recognize community engagement and cultural contributions.
                                        Set up automated rules to award badges based on participation.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setShowBadgeModal(true)}
                                    className="bg-yellow-500 hover:bg-yellow-400 text-yellow-950 rounded-2xl h-12 px-6 font-black shadow-lg shadow-yellow-500/20 gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Create Custom Badge
                                </Button>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Badge Configuration - Left Column */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Badge Library</h3>
                                    <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                                        {['All', 'Bronze', 'Silver', 'Gold'].map(level => (
                                            <button key={level} className="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {eduBadges.map((badge) => (
                                        <div key={badge.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group flex items-start gap-4 cursor-pointer">
                                            <div className={`w-16 h-16 rounded-2xl ${badge.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-white`}>
                                                <badge.icon className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600`}>
                                                        {badge.level || 'Standard'}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Auto-Award</span>
                                                </div>
                                                <h4 className="font-black text-slate-900 text-lg leading-tight uppercase tracking-tighter">{badge.label}</h4>
                                                <p className="text-xs text-slate-500 font-medium italic">Recognized for {badge.label.toLowerCase()} excellence.</p>
                                            </div>
                                        </div>
                                    ))}
                                    {isHR && (
                                        <button
                                            onClick={() => setShowBadgeModal(true)}
                                            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-6 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all group min-h-[140px]"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-transform">
                                                <Plus className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600">Add New Badge</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Policy Configuration - Right Column */}
                            <div className="space-y-6">
                                <Card className="rounded-[40px] p-6 bg-white border-slate-100 shadow-xl shadow-slate-50">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Awarding Policy</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Event Participation</span>
                                                <input type="checkbox" className="toggle toggle-indigo h-4 w-8 bg-slate-200 checked:bg-indigo-600" defaultChecked />
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>Award</span>
                                                <select className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700">
                                                    <option>Community Champion</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>After</span>
                                                <input type="number" className="w-12 bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700" defaultValue="5" />
                                                <span>events attended</span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Kudos Receiver</span>
                                                <input type="checkbox" className="toggle toggle-indigo h-4 w-8 bg-slate-200 checked:bg-indigo-600" defaultChecked />
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>Award</span>
                                                <select className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700">
                                                    <option>Culture Icon</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>After</span>
                                                <input type="number" className="w-12 bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700" defaultValue="50" />
                                                <span>kudos received</span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black text-amber-900 uppercase tracking-widest">Innovation catalyst</span>
                                                <input type="checkbox" className="toggle toggle-amber h-4 w-8 bg-slate-200 checked:bg-amber-600" defaultChecked />
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-amber-700 font-bold">
                                                <span>Award "Innovation" after 10 submitted ideas</span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black text-rose-900 uppercase tracking-widest">Culture Ambassador</span>
                                                <input type="checkbox" className="toggle toggle-rose h-4 w-8 bg-slate-200 checked:bg-rose-600" defaultChecked />
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-rose-700 font-bold">
                                                <span>Award "Community" after 20 kudos given</span>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-12 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                            <Plus className="w-4 h-4" /> Add Custom Rule
                                        </Button>
                                    </div>
                                </Card>

                                <Card className="rounded-[40px] p-6 border-none bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-black text-xl">
                                            🏆
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Leaderboard</h3>
                                            <p className="text-indigo-100 font-medium text-sm">See who's making the biggest impact!</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {staffList.slice(0, showAllStaff ? staffList.length : 3).map((staff) => (
                                            <div key={staff.name} className="flex items-center justify-between bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-black text-white">{staff.rank}.</span>
                                                    <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-xs">{staff.avatar}</div>
                                                    <span className="font-bold text-white">{staff.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {staff.badges.slice(0, 1).map((badge, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 bg-indigo-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest">{badge}</span>
                                                    ))}
                                                    {staff.badges.length > 1 && (
                                                        <span className="px-2 py-0.5 bg-indigo-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest">+{staff.badges.length - 1}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {staffList.length > 3 && (
                                        <Button
                                            onClick={() => setShowAllStaff(!showAllStaff)}
                                            className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white rounded-xl h-10 font-bold text-xs uppercase tracking-widest"
                                        >
                                            {showAllStaff ? 'Show Less' : 'View All'}
                                        </Button>
                                    )}
                                </Card>

                                <Card className="rounded-[40px] p-6 border-none bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-black text-xl">
                                            🏆
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg leading-tight">Gamifiction Impact</h4>
                                            <p className="text-xs font-medium text-indigo-200">Engagement boosted by 24%</p>
                                        </div>
                                    </div>
                                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full w-3/4 bg-yellow-400 rounded-full" />
                                    </div>
                                    <p className="text-[10px] font-bold text-indigo-100 mt-2 text-right">Target: 30% Growth</p>
                                </Card>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'ideas' ? (
                    <div className="space-y-8">
                        <Card className="rounded-[40px] p-8 border-none bg-slate-900 text-white shadow-2xl shadow-indigo-900/20">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Idea Spark</h3>
                                    <p className="text-slate-400 font-medium max-w-md">Submit your institutional ideas and see them come to life through employee-led initiatives.</p>
                                </div>
                                <Button
                                    onClick={() => setShowIdeaModal(true)}
                                    className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-2xl h-14 px-8 font-black shadow-xl shadow-indigo-900/40 gap-2"
                                >
                                    <Plus className="w-5 h-5" /> Submit New Idea
                                </Button>
                            </div>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {ideasList.map((idea) => (
                                <Card key={idea.id} className="rounded-[40px] p-8 bg-white border-slate-100 shadow-xl shadow-slate-100 relative group transition-all hover:border-indigo-200 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${idea.status === 'Implemented' ? 'bg-emerald-100 text-emerald-700' :
                                            idea.status === 'Under Review' ? 'bg-amber-100 text-amber-700' :
                                                'bg-indigo-100 text-indigo-700'
                                            }`}>
                                            {idea.status}
                                        </span>
                                    </div>

                                    <div className="space-y-6 pt-4">
                                        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                                            <Lightbulb className="w-7 h-7 text-orange-500" />
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight min-h-[3.5rem] line-clamp-2 uppercase tracking-tighter">{idea.title}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{idea.author}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-black text-slate-900">{idea.votes}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Votes</span>
                                            </div>
                                            <Button
                                                onClick={() => handleVote(idea.id)}
                                                variant="outline"
                                                className="rounded-xl border-orange-100 bg-orange-50 text-orange-600 font-black text-[10px] uppercase tracking-widest px-6 h-10 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                                            >
                                                Upvote
                                            </Button>
                                        </div>
                                    </div>

                                    {isHR && (
                                        <div className="absolute top-24 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button
                                                onClick={() => setIdeasList(ideasList.map(i => i.id === idea.id ? { ...i, title: `[Edited] ${i.title}` } : i))}
                                                className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
                                            >
                                                ✎
                                            </button>
                                            <button onClick={() => handleDelete('ideas', idea.id)} className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-lg">✕</button>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : activeTab === 'values' ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Core Values</h3>
                            {isHR && (
                                <Button
                                    onClick={() => setValuesList([{ id: Date.now(), title: 'Integrity First', content: 'We hold ourselves to the highest ethical standards in all our academic and professional dealings.', author: 'Community Norm', date: 'Core Value #04', image: false }, ...valuesList])}
                                    className="rounded-2xl bg-indigo-600 text-white font-bold h-11 px-6 shadow-xl shadow-indigo-100"
                                >
                                    Add New Value
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-12 gap-8">
                            <div className="col-span-12 lg:col-span-8 space-y-6">
                                {valuesList.map((entry) => (
                                    <Card key={entry.id} className="rounded-[40px] p-8 bg-white border-slate-100 shadow-xl shadow-slate-50 hover:border-indigo-200 transition-all group overflow-hidden relative">
                                        {isHR && (
                                            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <button
                                                    onClick={() => setValuesList(valuesList.map(v => v.id === entry.id ? { ...v, title: `[Edited] ${v.title} ` } : v))}
                                                    className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                                                >
                                                    ✎
                                                </button>
                                                <button onClick={() => handleDelete('values', entry.id)} className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">✕</button>
                                            </div>
                                        )}
                                        <div className="flex gap-8">
                                            <div className="flex-1 space-y-4">
                                                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{entry.date}</p>
                                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tighter leading-none">{entry.title}</h3>
                                                <p className="text-slate-500 font-medium leading-relaxed italic">"{entry.content}"</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100" />
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">{entry.author}</span>
                                                </div>
                                            </div>
                                            {entry.image && (
                                                <div className="hidden sm:block w-48 h-48 bg-slate-100 rounded-[32px] overflow-hidden group-hover:scale-105 transition-transform flex-shrink-0">
                                                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-200" />
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                            <div className="col-span-12 lg:col-span-4 space-y-8">
                                <Card className="rounded-[40px] p-8 border-none bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-2xl shadow-amber-900/20">
                                    <Sparkles className="w-12 h-12 text-white/50 mb-6" />
                                    <h3 className="text-3xl font-black leading-tight mb-4 tracking-tighter uppercase">Values Spotlight</h3>
                                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                        <h4 className="font-black text-lg mb-1 uppercase tracking-tighter">Value: "Empathy First"</h4>
                                        <p className="text-sm font-medium text-amber-50 opacity-90">Every student interaction is an opportunity for authentic connection.</p>
                                    </div>
                                    <p className="text-xs font-black mt-6 opacity-80 uppercase tracking-widest">Culture Pillar #03</p>
                                </Card>
                                <Card className="rounded-[40px] p-8 bg-white border-slate-100 shadow-xl shadow-slate-50 space-y-4">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Culture Calendar</h3>
                                    <div className="space-y-4">
                                        {[
                                            { event: 'Values Workshop', date: 'Feb 20', type: 'Faculty' },
                                            { event: 'Town Hall Meeting', date: 'Feb 24', type: 'Community' },
                                            { event: 'Ethics Seminar', date: 'Mar 02', type: 'Academic' }
                                        ].map(e => (
                                            <div key={e.event} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-900 leading-none">{e.event}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{e.type}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-indigo-600 leading-none">{e.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="ghost" className="w-full h-12 rounded-2xl font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest text-[10px]">Full Calendar</Button>
                                </Card>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'kudos' ? (
                    <div className="space-y-8">
                        <Card className="rounded-[40px] p-8 bg-white border-slate-100 shadow-xl shadow-slate-50">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                                        <Trophy className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Recognition Wall</h3>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                                        {['All', 'Mentorship', 'Innovation', 'Team Player'].map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setKudosFilter(f)}
                                                className={`px - 4 py - 2 rounded - xl text - xs font - black uppercase tracking - widest transition - all ${kudosFilter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'} `}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={() => setShowKudosForm(true)}
                                        className="rounded-2xl bg-slate-900 text-white font-bold h-11 px-6 shadow-xl shadow-slate-200"
                                    >
                                        Give Kudos
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {kudosList
                                    .filter(item => kudosFilter === 'All' || item.type.toLowerCase().includes(kudosFilter.toLowerCase()))
                                    .map((item) => {
                                        const theme = categoryThemes[item.type] || categoryThemes['default'];
                                        const totalKudosCount = item.likes + Object.values(item.reactions).reduce((a, b) => a + b, 0);
                                        const isSpotlight = totalKudosCount > 20;

                                        return (
                                            <div key={item.id} className={`p-8 rounded-[48px] ${theme.bg} ${theme.border} border-2 hover:bg-white transition-all duration-500 group relative flex flex-col shadow-sm hover:shadow-2xl hover:-translate-y-2`}>
                                                {isSpotlight && (
                                                    <div className="absolute -top-4 -right-4 bg-amber-500 text-white p-3 rounded-2xl shadow-lg animate-bounce">
                                                        <Sparkles className="w-5 h-5" />
                                                    </div>
                                                )}

                                                <div className="space-y-6 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 rounded-3xl bg-white shadow-md border-4 border-white overflow-hidden flex items-center justify-center font-black text-indigo-600 text-xl">
                                                                {item.to.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-slate-900 text-lg leading-none mb-1 tracking-tighter uppercase">{item.to}</h4>
                                                                <span className={`px-3 py-1 rounded-full ${theme.light} ${theme.accent} text-[9px] font-black uppercase tracking-widest`}>
                                                                    {item.type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {item.date}
                                                        </span>
                                                    </div>

                                                    <div className="relative">
                                                        <div className="absolute -left-2 top-0 text-4xl text-slate-200 font-serif leading-none italic opacity-50">"</div>
                                                        <p className="text-slate-600 leading-relaxed font-medium italic text-sm pl-4 pr-2">
                                                            {item.content}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        {Object.entries(item.reactions).map(([type, count]) => {
                                                            if (count === 0) return null;
                                                            const emoji = type === 'heart' ? '❤️' : type === 'clap' ? '👏' : type === 'smile' ? '😊' : type === 'fire' ? '🔥' : type === 'celebrate' ? '🙌' : type === 'laugh' ? '😂' : '😮';
                                                            return (
                                                                <span key={type} className="px-3 py-1 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-100 text-[10px] font-black text-slate-700 flex items-center gap-2 shadow-sm">
                                                                    {emoji} {count}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between relative">
                                                    {/* Reaction Picker Popover */}
                                                    {reactionPicker === item.id && (
                                                        <div className="absolute bottom-full left-0 mb-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 p-2 flex gap-3 animate-in fade-in slide-in-from-bottom-2 z-20">
                                                            {(['heart', 'clap', 'smile', 'fire', 'celebrate', 'laugh', 'wow'] as const).map(emoji => (
                                                                <button
                                                                    key={emoji}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleReaction(item.id, emoji);
                                                                    }}
                                                                    className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-xl transition-transform hover:scale-125"
                                                                >
                                                                    {emoji === 'heart' ? '❤️' : emoji === 'clap' ? '👏' : emoji === 'smile' ? '😊' : emoji === 'fire' ? '🔥' : emoji === 'celebrate' ? '🙌' : emoji === 'laugh' ? '😂' : '😮'}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setReactionPicker(reactionPicker === item.id ? null : item.id)}
                                                            className={`w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center ${theme.accent} shadow-sm hover:scale-110 transition-transform`}
                                                        >
                                                            <Heart className={`w-5 h-5 ${item.reactions.heart ? 'fill-current' : ''}`} />
                                                        </button>
                                                        <span className="text-sm font-black text-slate-900">{totalKudosCount}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setExpandedComments(expandedComments === item.id ? null : item.id)}
                                                            className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-all ${expandedComments === item.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                                        >
                                                            <MessageSquare className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSharedId(item.id);
                                                                setTimeout(() => setSharedId(null), 2000);
                                                            }}
                                                            className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-all ${sharedId === item.id ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                                        >
                                                            {sharedId === item.id ? <Check className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Comments Section */}
                                                {expandedComments === item.id && (
                                                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                                                        <div className="space-y-3">
                                                            {item.comments.map((comment, idx) => (
                                                                <div key={idx} className="flex gap-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                                                    <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex-shrink-0 flex items-center justify-center font-black text-[10px] text-slate-400">
                                                                        {comment.user.split(' ').map(n => n[0]).join('')}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-black text-slate-900 leading-none mb-1">{comment.user}</p>
                                                                        <p className="text-xs text-slate-500 font-medium">{comment.text}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                                                            <input
                                                                type="text"
                                                                value={commentText}
                                                                onChange={(e) => setCommentText(e.target.value)}
                                                                placeholder="Add a comment..."
                                                                className="flex-1 bg-transparent px-4 py-2 text-xs font-medium focus:outline-none"
                                                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(item.id)}
                                                            />
                                                            <Button
                                                                onClick={() => handleAddComment(item.id)}
                                                                className="h-10 w-10 p-0 rounded-xl bg-indigo-600 text-white flex items-center justify-center"
                                                            >
                                                                <ArrowUpRight className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        </Card>
                    </div>
                ) : activeTab === 'events' ? (
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Campus Activities</h3>
                                {isHR && (
                                    <Button
                                        onClick={() => setActivitiesList([{ id: Date.now(), title: 'New Campus Event', date: 'Upcoming', type: 'Community', rsvp: 0, location: 'TBD' }, ...activitiesList])}
                                        size="sm"
                                        className="bg-slate-900 text-white rounded-xl h-10 px-4 font-black flex gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Activity
                                    </Button>
                                )}
                            </div>
                            {activitiesList.map((event) => (
                                <Card key={event.id} className="rounded-[40px] p-8 bg-white border-slate-100 shadow-xl shadow-slate-50 hover:border-indigo-200 transition-all group relative">
                                    {isHR && (
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDelete('activities', event.id)} className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">✕</button>
                                        </div>
                                    )}
                                    <div className="flex gap-8">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">{event.type}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.date}</span>
                                                {isHR && (
                                                    <button
                                                        onClick={() => setActivitiesList(activitiesList.map(a => a.id === event.id ? { ...a, title: `[Edited] ${a.title} ` } : a))}
                                                        className="ml-auto w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all text-xs"
                                                    >
                                                        ✎
                                                    </button>
                                                )}
                                            </div>
                                            <h4 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tighter">{event.title}</h4>
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {event.rsvp} RSVPed</span>
                                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Auditorium</span>
                                            </div>
                                            <Button
                                                onClick={() => setIsRSVPed(!isRSVPed)}
                                                variant={isRSVPed ? "default" : "outline"}
                                                className={`rounded - 2xl font - [950] h - 14 px - 10 uppercase tracking - widest text - [11px] transition - all transform hover: scale - 105 active: scale - 95 shadow - xl ${isRSVPed ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200' : 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'} `}
                                            >
                                                {isRSVPed ? 'RSVP Confirmed' : 'RSVP & Join'}
                                            </Button>
                                        </div>
                                        <div className="hidden sm:block w-40 h-40 bg-slate-50 rounded-[32px] overflow-hidden group-hover:scale-105 transition-transform">
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-200 flex items-center justify-center">
                                                <Calendar className="w-12 h-12 text-indigo-300" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-[400px] bg-white rounded-[40px]">
                        <p className="text-slate-400 font-medium">Coming soon: Enhanced {subModules.find(m => m.id === activeTab)?.label} experience.</p>
                    </div>
                )
                }
                {/* Award Badge Modal */}
                {
                    showBadgeModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBadgeModal(false)} />
                            <Card className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
                                            <Star className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Award Badge</h3>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Institutional Honors</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowBadgeModal(false)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                        ✕
                                    </button>
                                </div>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Faculty</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Search faculty name..."
                                                    className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 px-6 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                                                />
                                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Education Badge</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {eduBadges.map(badge => (
                                                    <button
                                                        key={badge.id}
                                                        onClick={() => {
                                                            setSelectedBadge(badge.id);
                                                            setIsCustomBadge(false);
                                                        }}
                                                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group text-center ${selectedBadge === badge.id && !isCustomBadge ? 'bg-white border-indigo-600 shadow-md ring-1 ring-indigo-600' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-200'} `}
                                                    >
                                                        <div className={`w-10 h-10 rounded-xl ${badge.color} flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform`}>
                                                            <badge.icon className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase text-slate-600 leading-none">{badge.label}</span>
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => setIsCustomBadge(true)}
                                                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group text-center ${isCustomBadge ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-200'} `}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform`}>
                                                        <Plus className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase text-slate-600 leading-none">Custom Badge</span>
                                                </button>
                                            </div>

                                            {isCustomBadge && (
                                                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Badge Title</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g., Visionary Educator"
                                                            value={customBadgeTitle}
                                                            onChange={(e) => setCustomBadgeTitle(e.target.value)}
                                                            className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Badge Emoji Icon</label>
                                                        <div className="flex gap-2">
                                                            {['⭐', '🔥', '🏆', '💎', '🎨', '🚀'].map(emoji => (
                                                                <button
                                                                    key={emoji}
                                                                    onClick={() => setCustomBadgeIcon(emoji)}
                                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${customBadgeIcon === emoji ? 'bg-amber-100 border-2 border-amber-500' : 'bg-slate-50 border border-slate-100 hover:bg-white'} `}
                                                                >
                                                                    {emoji}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button variant="outline" onClick={() => setShowBadgeModal(false)} className="flex-1 h-14 rounded-2xl border-slate-200 font-black text-slate-600 uppercase tracking-widest text-xs">
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                if (isCustomBadge) {
                                                    if (!customBadgeTitle) return;
                                                    const newBadge = {
                                                        id: Date.now(),
                                                        label: customBadgeTitle,
                                                        icon: Star,
                                                        color: 'bg-amber-500',
                                                        level: 'Custom'
                                                    };
                                                    setEduBadges([...eduBadges, newBadge]);
                                                    alert(`Custom badge "${customBadgeTitle}" created and saved to library!`);
                                                }
                                                setShowBadgeModal(false);
                                                setIsCustomBadge(false);
                                                setCustomBadgeTitle("");
                                            }}
                                            disabled={(!selectedBadge && !isCustomBadge) || (isCustomBadge && !customBadgeTitle)}
                                            className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 disabled:opacity-50"
                                        >
                                            {isCustomBadge ? 'Create & Save' : 'Confirm Award'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )
                }
                {/* Kudos Form Modal */}
                {
                    showKudosForm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowKudosForm(false)} />
                            <Card className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center">
                                            <Trophy className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Give Kudos</h3>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Recognition Wall</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowKudosForm(false)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                        ✕
                                    </button>
                                </div>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recipient Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Prof. David Wilson"
                                                value={formRecipient}
                                                onChange={(e) => setFormRecipient(e.target.value)}
                                                className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 px-6 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Category</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Team Player', 'Innovator', 'Mentor', 'Leader', 'Unsung Hero'].map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setFormCategory(cat)}
                                                        className={`py-3 rounded-xl border transition-all text-[10px] font-black uppercase ${formCategory === cat ? 'bg-amber-500 border-amber-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-amber-200'}`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recognition Message</label>
                                            <textarea
                                                rows={4}
                                                placeholder="Tell them why they're awesome..."
                                                value={formMessage}
                                                onChange={(e) => setFormMessage(e.target.value)}
                                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 p-6 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleAddKudos}
                                        className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-200"
                                    >
                                        Send Kudos
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )
                }

                {/* Submit Idea Modal */}
                {
                    showIdeaModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowIdeaModal(false)} />
                            <Card className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
                                            <Lightbulb className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Submit New Idea</h3>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Innovation Hub</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowIdeaModal(false)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                        ✕
                                    </button>
                                </div>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Idea Title</label>
                                            <input
                                                type="text"
                                                placeholder="What's your big idea?"
                                                value={ideaTitle}
                                                onChange={(e) => setIdeaTitle(e.target.value)}
                                                className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 px-6 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Supporting Description</label>
                                            <textarea
                                                rows={4}
                                                placeholder="How will this help the institution?"
                                                value={ideaDesc}
                                                onChange={(e) => setIdeaDesc(e.target.value)}
                                                className="w-full rounded-2xl bg-slate-50 border border-slate-100 p-6 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            if (!ideaTitle) return;
                                            setIdeasList([{ id: Date.now(), title: ideaTitle, votes: 0, author: 'You', status: 'Voting' }, ...ideasList]);
                                            setShowIdeaModal(false);
                                            setIdeaTitle("");
                                            setIdeaDesc("");
                                        }}
                                        disabled={!ideaTitle}
                                        className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200"
                                    >
                                        Spark Innovation
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )
                }
                {/* Analytics Modal */}
                {
                    showAnalytics && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAnalytics(false)} />
                            <Card className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
                                            <Activity className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Culture Analytics</h3>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Real-time engagement insights</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowAnalytics(false)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                        ✕
                                    </button>
                                </div>
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100">
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Total Kudos</p>
                                            <h4 className="text-3xl font-black text-slate-900">1,248</h4>
                                            <p className="text-xs text-indigo-600 font-bold mt-1">+12% from last month</p>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Active Clubs</p>
                                            <h4 className="text-3xl font-black text-slate-900">12</h4>
                                            <p className="text-xs text-emerald-600 font-bold mt-1">4 new requests pending</p>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100">
                                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Event RSVP Rate</p>
                                            <h4 className="text-3xl font-black text-slate-900">78%</h4>
                                            <p className="text-xs text-amber-600 font-bold mt-1">Highest: Tech Symposium</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Engagement Trends</h4>
                                        <div className="h-48 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center overflow-hidden">
                                            <div className="flex items-end gap-4 h-full pt-10 pb-4 px-10">
                                                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-indigo-500 rounded-t-xl transition-all hover:bg-violet-600 cursor-pointer group relative" style={{ height: `${h}%` }}>
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded block">
                                                            {h}%
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )
                }
            </main >

            {/* Request Club Modal */}
            {
                showClubModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowClubModal(false)} />
                        <Card className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-violet-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Request New Club</h3>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Community Building</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowClubModal(false)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    ✕
                                </button>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                    <p className="text-xs text-amber-800 font-medium">New clubs require HR approval. Once approved, you will be assigned as the Club Admin.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Club Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Robotics Club"
                                            value={newClubName}
                                            onChange={(e) => setNewClubName(e.target.value)}
                                            className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 px-6 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Expected Activity</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Weekly workshops on automation"
                                            value={newClubActivity}
                                            onChange={(e) => setNewClubActivity(e.target.value)}
                                            className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 px-6 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={handleCreateClub}
                                    disabled={!newClubName}
                                    className="w-full h-14 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-violet-200"
                                >
                                    Submit for Approval
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )
            }

            {/* Staff Details Modal */}
            {
                selectedStaff && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedStaff(null)}>
                        <div className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl space-y-6" onClick={e => e.stopPropagation()}>
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-3xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 font-black text-2xl">
                                    {selectedStaff.avatar}
                                </div>
                                <h3 className="text-xl font-black text-slate-900">{selectedStaff.name}</h3>
                                <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">Rank #{selectedStaff.rank}</p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Earned Badges</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {selectedStaff.badges.map((badge: string, idx: number) => {
                                        const badgeDef = eduBadges.find(b => b.label === badge) || { color: 'bg-slate-500', icon: Star };
                                        return (
                                            <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                                                <div className={`w-8 h-8 rounded-lg ${badgeDef.color} flex items-center justify-center text-white scale-75`}>
                                                    <badgeDef.icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-700 leading-tight">{badge}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <Button onClick={() => setSelectedStaff(null)} className="w-full rounded-2xl font-black h-12 bg-slate-100 text-slate-900 hover:bg-slate-200">
                                Close
                            </Button>
                        </div>
                    </div>
                )
            }

            {/* All Staff View Modal */}
            {
                showAllStaff && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAllStaff(false)}>
                        <div className="bg-white rounded-[40px] p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-slate-900">Leaderboard</h3>
                                <button onClick={() => setShowAllStaff(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-500 font-bold transition-colors">✕</button>
                            </div>
                            <div className="space-y-3">
                                {staffList.map((user) => (
                                    <div
                                        key={user.rank}
                                        onClick={() => { setSelectedStaff(user); setShowAllStaff(false); }}
                                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xl font-black w-8 ${user.rank <= 3 ? 'text-amber-500' : 'text-slate-300'} `}>#{user.rank}</span>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${user.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'} `}>
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-slate-900">{user.name}</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.badges.length} Badges</p>
                                            </div>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {user.badges.slice(0, 3).map((badge, i) => {
                                                const badgeDef = eduBadges.find(b => b.label === badge) || { color: 'bg-slate-500' };
                                                return (
                                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${badgeDef.color} shadow-sm`} />
                                                )
                                            })}
                                            {user.badges.length > 3 && (
                                                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">+{user.badges.length - 3}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default EngagementCulture;
