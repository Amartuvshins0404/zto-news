
import { Clock, Edit2, Eye, Image, Languages, LayoutDashboard, MessageSquare, MousePointer, Plus, Send, Trash2, TrendingDown, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';
import { Button, Card, IconButton, Input, Modal, Select } from '../components/UI';
import { deleteArticle, deleteComment, deleteMedia, getAnalytics, getArticles, getComments, getMedia, replyToComment } from '../services/api';
import { useTranslation } from '../services/translationService';
import { AnalyticsDashboardData, Article, Comment, MediaItem } from '../types';

export const AdminDashboard: React.FC = () => {
    const { t, dictionary, lang, updateTranslation, addLanguage, removeLanguage, availableLanguages } = useTranslation();
    const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'comments' | 'media' | 'translations'>('overview');

    // Data State
    const [analytics, setAnalytics] = useState<AnalyticsDashboardData | null>(null);
    const [posts, setPosts] = useState<Article[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [media, setMedia] = useState<MediaItem[]>([]);

    // Interaction State
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
    const [replyText, setReplyText] = useState('');

    // Translation State
    const [targetLang, setTargetLang] = useState<string>('mn');
    const [newLangCode, setNewLangCode] = useState('');

    useEffect(() => {
        getAnalytics().then(setAnalytics);
        getArticles().then(setPosts);
        getComments().then(setComments);
        getMedia().then(setMedia);
    }, []);

    const handleDeletePost = (id: string) => {
        if (window.confirm(t('cat_confirm_delete'))) {
            deleteArticle(id).then(() => setPosts(prev => prev.filter(p => p.id !== id)));
        }
    };

    const handleDeleteComment = (id: string) => {
        deleteComment(id).then(() => setComments(prev => prev.filter(c => c.id !== id)));
    };

    const handleReply = (comment: Comment) => {
        setSelectedComment(comment);
        setReplyModalOpen(true);
    };

    const submitReply = () => {
        if (selectedComment) {
            replyToComment(selectedComment.id, replyText);
            setReplyModalOpen(false);
            setReplyText('');
            setSelectedComment(null);
            alert(t('comment_success'));
        }
    };

    const handleDeleteMedia = (id: string) => {
        if (window.confirm(t('cat_confirm_delete'))) {
            deleteMedia(id).then(() => setMedia(prev => prev.filter(m => m.id !== id)));
        }
    };

    const handleAddLanguage = () => {
        if (newLangCode && !availableLanguages.includes(newLangCode)) {
            addLanguage(newLangCode);
            setNewLangCode('');
        }
    };

    const renderOverview = () => {
        if (!analytics) return null;

        const iconMap: any = {
            'Total Views': <Eye className="w-5 h-5 text-blue-500" />,
            'Avg. Read Time': <Clock className="w-5 h-5 text-orange-500" />,
            'Engagement Rate': <MousePointer className="w-5 h-5 text-purple-500" />,
            'Bounce Rate': <Users className="w-5 h-5 text-teal-500" />
        };

        return (
            <div className="space-y-8 animate-fade-in">
                {/* Scorecards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {analytics.kpis.map((kpi, idx) => (
                        <Card key={idx} className="p-6 border-l-4 border-l-primary-500">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    {iconMap[kpi.label] || <TrendingUp className="w-5 h-5 text-gray-500" />}
                                </div>
                                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${kpi.trend === 'up' ? 'bg-green-100 text-green-700' : kpi.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                    {Math.abs(kpi.change)}%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{kpi.label}</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</p>
                        </Card>
                    ))}
                </div>

                {/* Main Trends Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="p-6 lg:col-span-2 h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Audience Growth</h3>
                            <select className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={analytics.trends}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#163D63" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#163D63" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E23B2F" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#E23B2F" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="views" stroke="#163D63" fillOpacity={1} fill="url(#colorViews)" />
                                <Area type="monotone" dataKey="visitors" stroke="#E23B2F" fillOpacity={1} fill="url(#colorVisitors)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Device Breakdown */}
                    <Card className="p-6 h-[400px]">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Device Breakdown</h3>
                        <ResponsiveContainer width="100%" height="70%">
                            <PieChart>
                                <Pie
                                    data={analytics.devices}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analytics.devices.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-500">Most users browse via <span className="font-bold text-primary-600">{analytics.devices.length > 0 ? analytics.devices.reduce((a, b) => a.value > b.value ? a : b).name : 'N/A'}</span></p>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Traffic Sources */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Traffic Sources</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart layout="vertical" data={analytics.traffic} margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="source" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" fill="#3d7eb0" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Top Content */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Performing Content</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left text-xs font-bold text-gray-500 uppercase pb-2">Title</th>
                                        <th className="text-right text-xs font-bold text-gray-500 uppercase pb-2">Views</th>
                                        <th className="text-right text-xs font-bold text-gray-500 uppercase pb-2">Shares</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {analytics.topContent.map(content => (
                                        <tr key={content.id}>
                                            <td className="py-3 text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{content.title}</td>
                                            <td className="py-3 text-right text-sm text-gray-600 dark:text-gray-400 font-mono">{content.views.toLocaleString()}</td>
                                            <td className="py-3 text-right text-sm text-green-600 font-mono">{content.shares}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        );
    };

    // ... (Posts, Comments, Media, Translations render functions largely remain same layout-wise)

    const renderPosts = () => (
        <Card className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('editor_title_label')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('published_on')}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-dark divide-y divide-gray-200 dark:divide-gray-700">
                    {posts.map(post => (
                        <tr key={post.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{post.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="ghost" size="sm" className="mr-2"><Edit2 className="w-4 h-4" /></Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeletePost(post.id)}><Trash2 className="w-4 h-4" /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );

    const renderComments = () => (
        <div className="space-y-4">
            {comments.map(comment => (
                <Card key={comment.id} className="p-4 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-primary-900 dark:text-white">{comment.author}</span>
                            <span className="text-xs text-gray-500">{new Date(comment.date).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{comment.text}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleReply(comment)}>{t('admin_reply')}</Button>
                        <IconButton className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteComment(comment.id)}><Trash2 className="w-4 h-4" /></IconButton>
                    </div>
                </Card>
            ))}

            <Modal isOpen={replyModalOpen} onClose={() => setReplyModalOpen(false)} title={`${t('admin_reply')} to ${selectedComment?.author}`}>
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 italic border-l-2 border-primary-500 pl-3">"{selectedComment?.text}"</p>
                    <textarea
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-primary-500 outline-none h-32"
                        placeholder={t('comment_placeholder')}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button onClick={submitReply}><Send className="w-4 h-4 mr-2" /> {t('comment_submit')}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );

    const renderMedia = () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media.map(item => (
                <div key={item.id} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square">
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="danger" size="sm" onClick={() => handleDeleteMedia(item.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderTranslations = () => (
        <div className="space-y-6">
            <div className="flex gap-4 items-end bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t('admin_add_lang')}</label>
                    <Input
                        placeholder={t('admin_lang_code')}
                        value={newLangCode}
                        onChange={(e) => setNewLangCode(e.target.value)}
                    />
                </div>
                <Button onClick={handleAddLanguage}><Plus className="w-4 h-4 mr-2" /> {t('admin_add_lang')}</Button>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Edit Dictionary</h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Target Language:</span>
                    <Select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                        {availableLanguages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                    </Select>
                    {targetLang !== 'en' && targetLang !== 'mn' && (
                        <Button variant="danger" size="sm" onClick={() => removeLanguage(targetLang)}><Trash2 className="w-4 h-4" /></Button>
                    )}
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/3">Key</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value ({targetLang})</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-dark divide-y divide-gray-200 dark:divide-gray-700">
                            {Object.keys(dictionary['en']).map(key => (
                                <tr key={key}>
                                    <td className="px-6 py-2 text-sm text-gray-500 font-mono">{key}</td>
                                    <td className="px-6 py-2">
                                        <input
                                            className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white text-sm"
                                            value={dictionary[targetLang]?.[key] || ''}
                                            onChange={(e) => updateTranslation(targetLang, key, e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-serif font-bold text-primary-900 dark:text-white mb-8">{t('admin_dashboard')}</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {[
                            { id: 'overview', icon: LayoutDashboard, label: t('admin_overview') },
                            { id: 'posts', icon: Edit2, label: t('admin_posts') },
                            { id: 'comments', icon: MessageSquare, label: t('admin_comments') },
                            { id: 'media', icon: Image, label: t('admin_media') },
                            { id: 'translations', icon: Languages, label: t('admin_translations') },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'posts' && renderPosts()}
                    {activeTab === 'comments' && renderComments()}
                    {activeTab === 'media' && renderMedia()}
                    {activeTab === 'translations' && renderTranslations()}
                </div>
            </div>
        </div>
    );
};
