import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Plus, Activity, Heart, Trophy, Calendar, Sparkles, Users, BookOpen, AlertCircle,
    Lightbulb, Search, Star, MessageSquare, Clock, MapPin, Check, ArrowUpRight, Home, Badge
} from 'lucide-react';
import Layout from '../components/Layout';
import { usePersona } from '../contexts/PersonaContext';

const EngagementCulture: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showKudosForm, setShowKudosForm] = useState(false);
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [showIdeaModal, setShowIdeaModal] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [isRSVPed, setIsRSVPed] = useState(false);
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
        <Layout 
            title="Engagement & Culture" 
            description="Foster a thriving community through recognition, events, and shared values." 
            icon={Heart}
            showHome={true}
            headerActions={
                isHR ? (
                    <div className="flex gap-2 text-xs">
                        <Button
                            onClick={() => setShowKudosForm(true)}
                            size="sm"
                            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm"
                        >
                            <Trophy className="w-4 h-4 mr-2" /> Give Kudos
                        </Button>
                        <Button
                            onClick={() => setShowAnalytics(true)}
                            size="sm"
                            variant="outline"
                            className="bg-white rounded-lg shadow-sm"
                        >
                            <Activity className="w-4 h-4 mr-2" /> Analytics
                        </Button>
                    </div>
                ) : null
            }
        >
            <div className="font-sans text-slate-900 space-y-8 mt-2">

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-200 bg-white sticky top-0 z-30 pt-4">
                {subModules.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${activeTab === tab.id
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Welcome Card */}
                        <Card className="col-span-full lg:col-span-2 rounded-xl p-8 bg-indigo-900 text-white shadow-md relative overflow-hidden group">
                            <div className="relative z-10 space-y-6">
                                <span className="inline-block px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-indigo-100 text-[10px] font-bold uppercase tracking-widest">
                                    Quote of the Day
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                                    "Culture is typically <span className="text-indigo-300">what we do</span> when no one is looking."
                                </h2>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-base leading-none">Shared by Ms. Reshma Binu Prasad</p>
                                        <p className="text-indigo-400 text-xs font-medium uppercase tracking-widest mt-1">Community Contributor</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Stats */}
                        <div className="space-y-4">
                            <Card className="rounded-xl p-6 bg-white border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                                <div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Kudos Given</p>
                                    <h3 className="text-3xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">1,248</h3>
                                </div>
                                <div className="w-14 h-14 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Trophy className="w-7 h-7" />
                                </div>
                            </Card>
                            <Card className="rounded-xl p-6 bg-white border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                                <div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Upcoming Events</p>
                                    <h3 className="text-3xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">8</h3>
                                </div>
                                <div className="w-14 h-14 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <Calendar className="w-7 h-7" />
                                </div>
                            </Card>
                        </div>

                        {/* Recent Kudos Feed (Mini) */}
                        <div className="col-span-full py-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Recent Shoutouts</h3>
                                <button
                                    onClick={() => setActiveTab('kudos')}
                                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-[10px] uppercase tracking-widest transition-colors"
                                >
                                    View All Feed
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {kudosList.slice(0, 4).map((item) => (
                                    <div key={item.id} className="p-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-widest ${item.type === 'Mentorship' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'} `}>
                                                {item.type}
                                            </div>
                                            <Heart className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-500 transition-colors" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-900 mb-2">To: {item.to}</p>
                                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-4 italic">"{item.content}"</p>
                                        <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                                            <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200" />
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">From: System User</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Events Preview */}
                    </div>
                ) : activeTab === 'wellness' ? (
                    <div className="flex items-center justify-center min-h-[400px] bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10 text-center space-y-4 max-w-md p-8">
                            <div className="w-16 h-16 rounded-xl bg-slate-50 text-indigo-600 border border-slate-100 flex items-center justify-center mx-auto shadow-sm">
                                <Activity className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Coming Soon</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    We're building a comprehensive wellness experience for our community. Stay tuned for new initiatives and resources.
                                </p>
                            </div>
                            <div className="pt-2">
                                <span className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-bold uppercase tracking-widest">
                                    Work in Progress
                                </span>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'clubs' ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-end">
                            <Button
                                onClick={() => setShowClubModal(true)}
                                className="bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-11 px-6 font-bold shadow-sm gap-2"
                            >
                                <Plus className="w-4 h-4" /> Request New Club
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clubsList.map((club) => {
                                const isJoined = joinedClubs.includes(club.name);
                                const isPending = club.status === 'Pending';
                                return (
                                    <Card key={club.id} className="rounded-xl p-6 bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group flex flex-col h-full relative">
                                        {isPending && (
                                            <div className="absolute top-4 right-4">
                                                <span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-[8px] font-bold uppercase tracking-widest">
                                                    Pending Review
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-lg ${club.bg} border border-slate-100 flex items-center justify-center ${club.color}`}>
                                                <club.icon className="w-6 h-6" />
                                            </div>
                                            <span className="px-2 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                <Users className="w-3 h-3" /> {club.members}
                                            </span>
                                        </div>
                                        <div className="space-y-1 mb-6 flex-1">
                                            <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{club.name}</h3>
                                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{club.activity}</p>
                                        </div>
                                        <div className="space-y-2 mt-auto">
                                            {isHR && isPending ? (
                                                <Button
                                                    onClick={() => handleApproveClub(club.id)}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-9 font-bold uppercase tracking-widest text-[9px]"
                                                >
                                                    Approve Request
                                                </Button>
                                            ) : isJoined ? (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button variant="outline" className="w-full text-indigo-600 font-bold border-indigo-100 hover:bg-indigo-50 rounded-lg h-9 gap-2 text-[10px] uppercase tracking-wider">
                                                        Chat
                                                    </Button>
                                                    <Button variant="outline" className="w-full text-indigo-600 font-bold border-indigo-100 hover:bg-indigo-50 rounded-lg h-9 gap-2 text-[10px] uppercase tracking-wider">
                                                        Event
                                                    </Button>
                                                </div>
                                            ) : !isPending && (
                                                <Button
                                                    onClick={() => setJoinedClubs([...joinedClubs, club.name])}
                                                    variant="ghost"
                                                    className="w-full text-indigo-600 font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-50 rounded-lg h-9"
                                                >
                                                    Join Community
                                                </Button>
                                            )}
                                            {isPending && !isHR && (
                                                <p className="text-center text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest italic py-1 border border-slate-100 rounded-lg">Verification Pending</p>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ) : activeTab === 'badges' ? (
                    <div className="space-y-6">
                        <Card className="rounded-xl p-8 border border-slate-200 bg-white shadow-sm relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-2 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight flex items-center justify-center md:justify-start gap-3">
                                        <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-100">
                                            <Badge className="w-6 h-6 text-yellow-600" />
                                        </div>
                                        Badges & Recognition
                                    </h3>
                                    <p className="text-slate-500 text-sm max-w-xl font-medium">
                                        Monitor digital achievements and community contributions. Automated rules award badges based on performance and engagement.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setShowBadgeModal(true)}
                                    className="bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-11 px-6 font-bold shadow-sm gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Create Badge
                                </Button>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Badge Configuration - Left Column */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">Badge Repository</h3>
                                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                        {['All', 'Bronze', 'Silver', 'Gold'].map(level => (
                                            <button key={level} className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:bg-white hover:text-indigo-600 transition-all">
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {eduBadges.map((badge) => (
                                        <div key={badge.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group flex items-start gap-4">
                                            <div className={`w-14 h-14 rounded-lg ${badge.color} border border-white/20 flex items-center justify-center shrink-0 text-white shadow-sm`}>
                                                <badge.icon className="w-7 h-7" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200`}>
                                                        {badge.level || 'Standard'}
                                                    </span>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Auto</span>
                                                </div>
                                                <h4 className="font-bold text-slate-900 text-base uppercase tracking-tight">{badge.label}</h4>
                                                <p className="text-[10px] text-slate-500 font-medium">Earned for {badge.label.toLowerCase()} excellence.</p>
                                            </div>
                                        </div>
                                    ))}
                                    {isHR && (
                                        <button
                                            onClick={() => setShowBadgeModal(true)}
                                            className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all group min-h-[120px]"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                                                <Plus className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-indigo-600">New Achievement</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Policy Configuration - Right Column */}
                            <div className="space-y-6">
                                <Card className="rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Awarding Rules</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Event Participation</span>
                                                <input type="checkbox" className="accent-indigo-600 h-4 w-4" defaultChecked />
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <span>Award</span>
                                                <select className="bg-white border border-slate-200 rounded-md px-2 py-1 font-bold text-slate-700 outline-none">
                                                    <option>Community Champion</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <span>After</span>
                                                <input type="number" className="w-10 bg-white border border-slate-200 rounded-md px-2 py-1 font-bold text-slate-700 outline-none" defaultValue="5" />
                                                <span>attendances</span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Recognition Level</span>
                                                <input type="checkbox" className="accent-indigo-600 h-4 w-4" defaultChecked />
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <span>Award</span>
                                                <select className="bg-white border border-slate-200 rounded-md px-2 py-1 font-bold text-slate-700 outline-none">
                                                    <option>Culture Icon</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <span>After</span>
                                                <input type="number" className="w-10 bg-white border border-slate-200 rounded-md px-2 py-1 font-bold text-slate-700 outline-none" defaultValue="50" />
                                                <span>shoutouts</span>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-slate-900 text-white hover:bg-black rounded-lg h-10 font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                            <Plus className="w-3.5 h-3.5" /> Define New Rule
                                        </Button>
                                    </div>
                                </Card>

                                <Card className="rounded-xl p-6 bg-slate-900 text-white shadow-lg relative overflow-hidden">
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-yellow-400">
                                                <Trophy className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-white uppercase tracking-tight">Top Contributors</h3>
                                                <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Monthly Leaderboard</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {staffList.slice(0, showAllStaff ? staffList.length : 3).map((staff) => (
                                                <div key={staff.name} className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-bold text-white/50">{staff.rank}</span>
                                                        <div className="w-7 h-7 rounded-md bg-indigo-500 flex items-center justify-center text-[10px] font-bold">{staff.avatar}</div>
                                                        <span className="text-xs font-semibold text-white truncate max-w-[80px]">{staff.name.split(' ')[1]}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="px-1.5 py-0.5 bg-white/10 text-[7px] font-bold rounded-md uppercase tracking-tight">{staff.points} pts</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            onClick={() => setShowAllStaff(!showAllStaff)}
                                            className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg h-8 font-bold text-[9px] uppercase tracking-widest border border-white/10"
                                        >
                                            {showAllStaff ? 'Collapse' : 'Full Ranking'}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'ideas' ? (
                    <div className="space-y-6">
                        <Card className="rounded-xl p-8 border border-slate-200 bg-white shadow-sm">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-1 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Idea Exchange</h3>
                                    <p className="text-slate-500 text-sm font-medium">Contribute innovative concepts to improve our institutional ecosystem.</p>
                                </div>
                                <Button
                                    onClick={() => setShowIdeaModal(true)}
                                    className="bg-indigo-600 text-white hover:bg-slate-900 rounded-lg h-12 px-8 font-bold shadow-md gap-2 transition-all"
                                >
                                    <Plus className="w-4 h-4" /> Submit Proposal
                                </Button>
                            </div>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ideasList.map((idea) => (
                                <Card key={idea.id} className="rounded-xl p-6 bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group relative flex flex-col h-full overflow-hidden">
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest border ${idea.status === 'Implemented' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            idea.status === 'Under Review' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-indigo-50 text-indigo-600 border-indigo-100'
                                            }`}>
                                            {idea.status}
                                        </span>
                                    </div>

                                    <div className="space-y-5 flex-1">
                                        <div className="w-12 h-12 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
                                            <Lightbulb className="w-6 h-6 text-orange-600" />
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-base font-bold text-slate-900 tracking-tight leading-loose line-clamp-2 uppercase">{idea.title}</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200" />
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{idea.author}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-slate-900">{idea.votes}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Supports</span>
                                        </div>
                                        <Button
                                            onClick={() => handleVote(idea.id)}
                                            variant="outline"
                                            className="rounded-lg border-slate-200 bg-white text-slate-600 font-bold text-[9px] uppercase tracking-widest px-4 h-9 hover:border-indigo-600 hover:text-indigo-600 transition-all"
                                        >
                                            Upvote
                                        </Button>
                                    </div>

                                    {isHR && (
                                        <div className="absolute top-20 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setIdeasList(ideasList.map(i => i.id === idea.id ? { ...i, title: `[Edited] ${i.title}` } : i))}
                                                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                            >
                                                ✎
                                            </button>
                                            <button onClick={() => handleDelete('ideas', idea.id)} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">✕</button>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : activeTab === 'values' ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Core Mission & Values</h3>
                            {isHR && (
                                <Button
                                    onClick={() => setValuesList([{ id: Date.now(), title: 'Integrity First', content: 'We hold ourselves to the highest ethical standards in all our academic and professional dealings.', author: 'Community Norm', date: 'Core Value #04', image: false }, ...valuesList])}
                                    className="bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-11 px-6 font-bold shadow-sm transition-all"
                                >
                                    Define New Value
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 lg:col-span-8 space-y-4">
                                {valuesList.map((entry) => (
                                    <Card key={entry.id} className="rounded-xl p-8 bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group relative overflow-hidden">
                                        {isHR && (
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setValuesList(valuesList.map(v => v.id === entry.id ? { ...v, title: `[Edited] ${v.title} ` } : v))}
                                                    className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm text-xs"
                                                >
                                                    ✎
                                                </button>
                                                <button onClick={() => handleDelete('values', entry.id)} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">✕</button>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-8">
                                            <div className="flex-1 space-y-4">
                                                <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-widest">{entry.date}</span>
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-none">{entry.title}</h3>
                                                <p className="text-slate-600 text-sm leading-relaxed font-medium">"{entry.content}"</p>
                                                <div className="flex items-center gap-3 pt-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.author}</span>
                                                </div>
                                            </div>
                                            {entry.image && (
                                                <div className="hidden sm:block w-32 h-32 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden shrink-0">
                                                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                                                        <Sparkles className="w-8 h-8 text-indigo-200" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                            <div className="col-span-12 lg:col-span-4 space-y-6">
                                <Card className="rounded-xl p-8 bg-indigo-900 text-white shadow-md relative overflow-hidden">
                                    <Sparkles className="w-10 h-10 text-white/20 mb-4" />
                                    <h3 className="text-xl font-bold leading-tight mb-4 tracking-tight uppercase">Values Spotlight</h3>
                                    <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                                        <h4 className="font-bold text-base mb-1 uppercase tracking-tight text-white">"Empathy First"</h4>
                                        <p className="text-xs font-medium text-indigo-100">Every interaction is an opportunity for authentic connection.</p>
                                    </div>
                                    <p className="text-[10px] font-bold mt-6 text-indigo-300 uppercase tracking-widest">Cultural Pillar #03</p>
                                </Card>
                                <Card className="rounded-xl p-6 bg-white border border-slate-200 shadow-sm space-y-6">
                                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">Culture Calendar</h3>
                                    <div className="space-y-3">
                                        {[
                                            { event: 'Values Workshop', date: 'Feb 20', type: 'Faculty' },
                                            { event: 'Town Hall Meeting', date: 'Feb 24', type: 'Community' },
                                            { event: 'Ethics Seminar', date: 'Mar 02', type: 'Academic' }
                                        ].map(e => (
                                            <div key={e.event} className="flex justify-between items-center p-4 rounded-lg bg-slate-50 border border-slate-100">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-slate-900">{e.event}</p>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{e.type}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-indigo-600 uppercase italic">{e.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="ghost" className="w-full h-10 rounded-lg font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest text-[9px] border border-transparent hover:border-slate-100">
                                        View Full Calendar
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'kudos' ? (
                    <div className="space-y-6">
                        <Card className="rounded-xl p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
                                        <Trophy className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Recognition Wall</h3>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Institutional Appreciations</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 justify-center">
                                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                        {['All', 'Mentorship', 'Innovation', 'Team Player'].map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setKudosFilter(f)}
                                                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${kudosFilter === f ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'} `}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={() => setShowKudosForm(true)}
                                        className="bg-slate-900 hover:bg-black text-white rounded-lg h-10 px-6 font-bold shadow-sm flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Give Kudos
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {kudosList
                                .filter(item => kudosFilter === 'All' || item.type.toLowerCase().includes(kudosFilter.toLowerCase()))
                                .map((item) => {
                                    const totalKudosCount = item.likes + Object.values(item.reactions).reduce((a, b) => a + b, 0);
                                    const isSpotlight = totalKudosCount > 20;

                                    return (
                                        <div key={item.id} className="p-6 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-all group relative flex flex-col shadow-sm">
                                            {isSpotlight && (
                                                <div className="absolute -top-3 -right-3 bg-amber-500 text-white p-2 rounded-lg shadow-md z-10">
                                                    <Sparkles className="w-4 h-4" />
                                                </div>
                                            )}

                                            <div className="space-y-5 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
                                                            {item.to.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 text-sm leading-none mb-1 uppercase tracking-tight">{item.to}</h4>
                                                            <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100 text-[8px] font-bold uppercase tracking-widest">
                                                                {item.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {item.date}
                                                    </span>
                                                </div>

                                                <div className="relative py-2">
                                                    <p className="text-slate-600 leading-relaxed font-medium italic text-xs">
                                                        "{item.content}"
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {Object.entries(item.reactions).map(([type, count]) => {
                                                        if (count === 0) return null;
                                                        const emoji = type === 'heart' ? '❤️' : type === 'clap' ? '👏' : type === 'smile' ? '😊' : type === 'fire' ? '🔥' : type === 'celebrate' ? '🙌' : type === 'laugh' ? '😂' : '😮';
                                                        return (
                                                            <span key={type} className="px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-700 flex items-center gap-1.5 shadow-sm">
                                                                {emoji} {count}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setReactionPicker(reactionPicker === item.id ? null : item.id)}
                                                        className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white hover:text-red-500 transition-all hover:border-red-200"
                                                    >
                                                        <Heart className={`w-4 h-4 ${item.reactions.heart ? 'fill-red-500 text-red-500' : ''}`} />
                                                    </button>
                                                    <span className="text-xs font-bold text-slate-900">{totalKudosCount}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setExpandedComments(expandedComments === item.id ? null : item.id)}
                                                        className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${expandedComments === item.id ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200'}`}
                                                    >
                                                        <MessageSquare className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSharedId(item.id);
                                                            setTimeout(() => setSharedId(null), 2000);
                                                        }}
                                                        className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${sharedId === item.id ? 'bg-emerald-50 border-emerald-200 text-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200'}`}
                                                    >
                                                        {sharedId === item.id ? <Check className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Reaction Picker Popover */}
                                            {reactionPicker === item.id && (
                                                <div className="absolute bottom-16 left-6 p-2 bg-white rounded-lg shadow-xl border border-slate-100 flex gap-2 animate-in fade-in slide-in-from-bottom-2 z-20">
                                                    {(['heart', 'clap', 'smile', 'fire', 'celebrate'] as const).map(emoji => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => handleReaction(item.id, emoji)}
                                                            className="w-8 h-8 rounded-md hover:bg-slate-50 flex items-center justify-center text-base transition-transform hover:scale-110"
                                                        >
                                                            {emoji === 'heart' ? '❤️' : emoji === 'clap' ? '👏' : emoji === 'smile' ? '😊' : emoji === 'fire' ? '🔥' : '🙌'}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Comments Section */}
                                            {expandedComments === item.id && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                                                    <div className="space-y-2">
                                                        {item.comments.map((comment, idx) => (
                                                            <div key={idx} className="flex gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                                <div className="w-7 h-7 rounded-md bg-white border border-slate-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                                    {comment.user.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-slate-900 leading-none mb-1">{comment.user}</p>
                                                                    <p className="text-xs text-slate-500 font-medium">{comment.text}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={commentText}
                                                            onChange={(e) => setCommentText(e.target.value)}
                                                            placeholder="Add insights..."
                                                            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(item.id)}
                                                        />
                                                        <Button
                                                            onClick={() => handleAddComment(item.id)}
                                                            className="h-8 w-8 p-0 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0"
                                                        >
                                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ) : activeTab === 'events' ? (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Institutional Events</h3>
                                {isHR && (
                                    <Button
                                        onClick={() => setActivitiesList([{ id: Date.now(), title: 'New Campus Event', date: 'Upcoming', type: 'Community', rsvp: 0, location: 'TBD' }, ...activitiesList])}
                                        className="bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-10 px-5 font-bold flex gap-2 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Schedule Event
                                    </Button>
                                )}
                            </div>
                            {activitiesList.map((event) => (
                                <Card key={event.id} className="rounded-xl p-8 bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group relative">
                                    {isHR && (
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDelete('activities', event.id)} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">✕</button>
                                        </div>
                                    )}
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 space-y-5">
                                            <div className="flex items-center flex-wrap gap-3">
                                                <span className="px-2 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-md text-[9px] font-bold uppercase tracking-widest">{event.type}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock className="w-3 h-3" /> {event.date}</span>
                                                {isHR && (
                                                    <button
                                                        onClick={() => setActivitiesList(activitiesList.map(a => a.id === event.id ? { ...a, title: `[Edited] ${a.title} ` } : a))}
                                                        className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all text-[10px]"
                                                    >
                                                        ✎
                                                    </button>
                                                )}
                                            </div>
                                            <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-tight">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-300" /> {event.rsvp} Confirmed</span>
                                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-300" /> Main Hall</span>
                                            </div>
                                            <Button
                                                onClick={() => setIsRSVPed(!isRSVPed)}
                                                variant={isRSVPed ? "default" : "outline"}
                                                className={`rounded-lg font-bold h-11 px-8 uppercase tracking-widest text-[10px] transition-all ${isRSVPed ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent' : 'border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600'} `}
                                            >
                                                {isRSVPed ? 'RSVP Active' : 'Join Activity'}
                                            </Button>
                                        </div>
                                        <div className="hidden sm:block w-32 h-32 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden shrink-0">
                                            <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                                                <Calendar className="w-8 h-8 text-indigo-200" />
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
                {showBadgeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowBadgeModal(false)} />
                        <Card className="w-full max-w-lg bg-white rounded-xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
                                        <Star className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">Institutional Honors</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assign digital badge</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowBadgeModal(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    ✕
                                </button>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Select Faculty / Staff</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Begin typing name..."
                                                className="w-full h-11 rounded-lg bg-white border border-slate-200 px-4 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                            />
                                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Recognition Level</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {eduBadges.map(badge => (
                                                <button
                                                    key={badge.id}
                                                    onClick={() => {
                                                        setSelectedBadge(badge.id);
                                                        setIsCustomBadge(false);
                                                    }}
                                                    className={`p-3 rounded-lg border transition-all flex items-center gap-3 text-left ${selectedBadge === badge.id && !isCustomBadge ? 'bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-indigo-300'} `}
                                                >
                                                    <div className={`w-9 h-9 rounded-lg ${badge.color} border border-white/20 flex items-center justify-center text-white shrink-0 shadow-sm`}>
                                                        <badge.icon className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase text-slate-700 leading-tight">{badge.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setShowBadgeModal(false)} className="flex-1 h-11 rounded-lg border-slate-200 font-bold text-slate-600 uppercase tracking-widest text-[10px]">
                                        Dismiss
                                    </Button>
                                    <Button
                                        onClick={() => setShowBadgeModal(false)}
                                        className="flex-1 h-11 rounded-lg bg-indigo-600 hover:bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] shadow-sm"
                                    >
                                        Finalize Award
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {/* Kudos Form Modal */}
                {showKudosForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowKudosForm(false)} />
                        <Card className="w-full max-w-lg bg-white rounded-xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center shadow-md">
                                        <Trophy className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">Post Recognition</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Culture & Values</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowKudosForm(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    ✕
                                </button>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Recipient</label>
                                        <input
                                            type="text"
                                            placeholder="Member name..."
                                            value={formRecipient}
                                            onChange={(e) => setFormRecipient(e.target.value)}
                                            className="w-full h-11 rounded-lg bg-white border border-slate-200 px-4 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Contribution Type</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Team Player', 'Innovator', 'Mentor', 'Leader'].map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setFormCategory(cat)}
                                                    className={`py-2 px-3 rounded-lg border transition-all text-[10px] font-bold uppercase tracking-tight ${formCategory === cat ? 'bg-orange-500 border-orange-500 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-orange-200 hover:bg-white'} `}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Message</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Write a brief appreciation..."
                                            value={formMessage}
                                            onChange={(e) => setFormMessage(e.target.value)}
                                            className="w-full rounded-lg bg-white border border-slate-200 px-4 py-3 font-medium text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={handleAddKudos}
                                    className="w-full h-11 rounded-lg bg-orange-600 hover:bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] shadow-sm transition-all"
                                >
                                    Share Appreciation
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Submit Idea Modal */}
                {showIdeaModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowIdeaModal(false)} />
                        <Card className="w-full max-w-lg bg-white rounded-xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
                                        <Lightbulb className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">Innovation Hub</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submit Institutional Idea</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowIdeaModal(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    ✕
                                </button>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Idea Concept</label>
                                        <input
                                            type="text"
                                            placeholder="What is your proposal?"
                                            value={ideaTitle}
                                            onChange={(e) => setIdeaTitle(e.target.value)}
                                            className="w-full h-11 rounded-lg bg-white border border-slate-200 px-4 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Detail & Impact</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Describe how this improves our institution..."
                                            value={ideaDesc}
                                            onChange={(e) => setIdeaDesc(e.target.value)}
                                            className="w-full rounded-lg bg-white border border-slate-200 px-4 py-3 font-medium text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setShowIdeaModal(false)} className="flex-1 h-11 rounded-lg border-slate-200 font-bold text-slate-600 uppercase tracking-widest text-[10px]">
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (!ideaTitle) return;
                                            setIdeasList([{ id: Date.now(), title: ideaTitle, votes: 0, author: 'You', status: 'Voting' }, ...ideasList]);
                                            setShowIdeaModal(false);
                                            setIdeaTitle("");
                                            setIdeaDesc("");
                                        }}
                                        disabled={!ideaTitle}
                                        className="flex-1 h-11 rounded-lg bg-indigo-600 hover:bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] shadow-sm disabled:opacity-50 transition-all"
                                    >
                                        Submit Proposal
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {/* Analytics Modal */}
                {showAnalytics && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAnalytics(false)} />
                        <Card className="w-full max-w-2xl bg-white rounded-xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
                                        <Activity className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">Culture Analytics</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engagement & Trends</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowAnalytics(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    ✕
                                </button>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                                        <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-1.5">Kudos Sent</p>
                                        <h4 className="text-xl font-bold text-slate-900 leading-none">1,248</h4>
                                        <p className="text-[10px] text-indigo-600 font-semibold mt-2">↑ 12% Month-over-Month</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Active Clubs</p>
                                        <h4 className="text-xl font-bold text-slate-900 leading-none">12</h4>
                                        <p className="text-[10px] text-emerald-600 font-semibold mt-2">4 Pending Approvals</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                                        <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">Event RSVP Rate</p>
                                        <h4 className="text-xl font-bold text-slate-900 leading-none">78%</h4>
                                        <p className="text-[10px] text-amber-600 font-semibold mt-2">Highest Participation Yet</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Engagement Distribution</h4>
                                    <div className="h-40 bg-slate-50 rounded-lg border border-slate-100 flex items-end gap-3 px-8 pb-4">
                                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                            <div key={i} className="flex-1 bg-indigo-600 rounded-t-md hover:bg-slate-900 transition-all cursor-crosshair group relative" style={{ height: `${h}%` }}>
                                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-[9px] py-1 px-2 rounded whitespace-nowrap z-10">{h}% Activity</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between px-8 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main >

            {/* Request Club Modal */}
            {showClubModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowClubModal(false)} />
                    <Card className="w-full max-w-lg bg-white rounded-xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center shadow-md">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">Institutional Clubs</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apply for new community group</p>
                                </div>
                            </div>
                            <button onClick={() => setShowClubModal(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                ✕
                            </button>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 flex gap-3 italic">
                                <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                                <p className="text-[11px] text-indigo-800 font-semibold uppercase tracking-tight">All club requests undergo administrative review for curriculum alignment.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Formal Club Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Chess & Strategy League"
                                        value={newClubName}
                                        onChange={(e) => setNewClubName(e.target.value)}
                                        className="w-full h-11 rounded-lg bg-white border border-slate-200 px-4 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Proposed Learning Objectives</label>
                                    <input
                                        type="text"
                                        placeholder="Briefly state activity goals..."
                                        value={newClubActivity}
                                        onChange={(e) => setNewClubActivity(e.target.value)}
                                        className="w-full h-11 rounded-lg bg-white border border-slate-200 px-4 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleCreateClub}
                                disabled={!newClubName}
                                className="w-full h-11 rounded-lg bg-violet-600 hover:bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] shadow-sm transition-all"
                            >
                                Submit Official Request
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Staff Details Modal */}
            {selectedStaff && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedStaff(null)}>
                    <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl space-y-6 relative border border-slate-200" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 font-bold text-2xl shadow-sm">
                                {selectedStaff.avatar}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-none">{selectedStaff.name}</h3>
                            <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest mt-2 bg-indigo-50 py-1 px-3 rounded-full inline-block">Institutional Rank #{selectedStaff.rank}</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Verified Professional Badges</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {selectedStaff.badges.map((badge: string, idx: number) => {
                                    const badgeDef = eduBadges.find(b => b.label === badge) || { color: 'bg-slate-500', icon: Star };
                                    return (
                                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                                            <div className={`w-8 h-8 rounded-md ${badgeDef.color} flex items-center justify-center text-white shrink-0`}>
                                                <badgeDef.icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-700 leading-tight uppercase tracking-tighter">{badge}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <Button onClick={() => setSelectedStaff(null)} className="w-full rounded-lg font-bold h-11 bg-slate-900 hover:bg-slate-700 text-white uppercase tracking-widest text-[10px] shadow-sm">
                            Return to Portal
                        </Button>
                    </div>
                </div>
            )}

            {/* All Staff View Modal */}
            {showAllStaff && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAllStaff(false)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-slate-200 relative" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">Institutional Leaderboard</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professional Engagement Rankings</p>
                            </div>
                            <button onClick={() => setShowAllStaff(false)} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-colors">✕</button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-3">
                            {staffList.map((user) => (
                                <div
                                    key={user.rank}
                                    onClick={() => { setSelectedStaff(user); setShowAllStaff(false); }}
                                    className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-all cursor-pointer border border-slate-100 hover:border-indigo-200 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`text-lg font-bold w-10 ${user.rank <= 3 ? 'text-amber-600' : 'text-slate-300'} `}>#{user.rank}</span>
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-base shadow-sm ${user.rank <= 3 ? 'bg-amber-50 border border-amber-100 text-amber-700' : 'bg-slate-50 border border-slate-100 text-slate-700'} `}>
                                            {user.avatar}
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-slate-900 uppercase tracking-tight leading-none mb-1.5">{user.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 py-0.5 px-2 rounded-md border border-slate-100 inline-block">{user.badges.length} Verified Badges</p>
                                        </div>
                                    </div>
                                    <div className="flex -space-x-3 items-center">
                                        {user.badges.slice(0, 3).map((badge, i) => {
                                            const badgeDef = eduBadges.find(b => b.label === badge) || { color: 'bg-slate-500' };
                                            return (
                                                <div key={i} className={`w-9 h-9 rounded-lg border-2 border-white ${badgeDef.color} shadow-sm group-hover:scale-110 transition-transform`} />
                                            )
                                        })}
                                        {user.badges.length > 3 && (
                                            <div className="w-9 h-9 rounded-lg border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">+{user.badges.length - 3}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            </div>
        </Layout>
    );
};

export default EngagementCulture;
