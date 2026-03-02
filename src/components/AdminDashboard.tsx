import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Calendar, 
  Users, 
  Settings as SettingsIcon, 
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  X,
  Upload
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Post, Event, Subscriber, AnalyticsData } from '../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', type: 'travel', image_url: '' });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    const [postsRes, eventsRes, subsRes, analyticsRes] = await Promise.all([
      fetch('/api/posts'),
      fetch('/api/events'),
      fetch('/api/subscribers'),
      fetch('/api/analytics')
    ]);
    setPosts(await postsRes.json());
    setEvents(await eventsRes.json());
    setSubscribers(await subsRes.json());
    setAnalytics(await analyticsRes.json());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') { // Simple password for demo
      setIsLoggedIn(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    });
    if (res.ok) {
      setIsModalOpen(false);
      setNewPost({ title: '', content: '', type: 'travel', image_url: '' });
      fetchData();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.imageUrl) {
        setNewPost({ ...newPost, image_url: data.imageUrl });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    }
  };

  const handleDeleteSubscriber = async (id: number) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-stone-200">
          <h1 className="text-2xl font-serif font-bold mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter admin password"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id 
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
          : 'text-stone-500 hover:bg-stone-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-xl font-serif font-bold text-emerald-800">Navigator Admin</h2>
          <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Management Suite</p>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem id="analytics" icon={BarChart3} label="Analytics" />
          <SidebarItem id="posts" icon={FileText} label="Post Editor" />
          <SidebarItem id="media" icon={ImageIcon} label="Media Manager" />
          <SidebarItem id="events" icon={Calendar} label="Events Manager" />
          <SidebarItem id="subscribers" icon={Users} label="Subscribers" />
          <SidebarItem id="settings" icon={SettingsIcon} label="Settings" />
        </nav>

        <button 
          onClick={() => setIsLoggedIn(false)}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-800 capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-stone-500">Manage your website content and performance.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            <Plus size={20} />
            <span>Create New</span>
          </button>
        </header>

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Views', value: '12,482', trend: '+12%', color: 'emerald' },
                { label: 'Subscribers', value: subscribers.length, trend: '+5%', color: 'blue' },
                { label: 'Bounce Rate', value: '42%', trend: '-2%', color: 'amber' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <p className="text-sm text-stone-500 font-medium uppercase tracking-wider">{stat.label}</p>
                  <div className="flex items-end gap-3 mt-2">
                    <span className="text-3xl font-bold text-stone-800">{stat.value}</span>
                    <span className={`text-sm font-medium mb-1 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm h-96">
              <h3 className="text-lg font-serif font-bold mb-6">Traffic Overview (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.length > 0 ? analytics : [
                  { date: 'Mon', views: 400 }, { date: 'Tue', views: 300 }, { date: 'Wed', views: 600 },
                  { date: 'Thu', views: 800 }, { date: 'Fri', views: 500 }, { date: 'Sat', views: 900 },
                  { date: 'Sun', views: 1100 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#059669" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-bottom border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">Type</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-800">{post.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.type === 'travel' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {post.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-stone-400 italic">No posts found. Create your first story!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-bottom border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">Email Address</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">Joined Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-800">{sub.email}</td>
                    <td className="px-6 py-4 text-sm text-stone-500">{new Date(sub.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          Active
                        </span>
                        <button 
                          onClick={() => handleDeleteSubscriber(sub.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-stone-400 italic">No subscribers yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {['media', 'events', 'settings'].includes(activeTab) && (
          <div className="bg-white p-20 rounded-2xl border border-stone-200 shadow-sm text-center">
            <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <SettingsIcon size={32} className="text-stone-400" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-800">Module Under Construction</h3>
            <p className="text-stone-500 mt-2 max-w-md mx-auto">
              We're currently building the {activeTab} module. Check back soon for full management capabilities!
            </p>
          </div>
        )}

        {/* Create Post Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h2 className="text-xl font-serif font-bold">Create New Post</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-stone-600 mb-1">Title</label>
                    <input 
                      type="text" 
                      required
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Type</label>
                    <select 
                      value={newPost.type}
                      onChange={(e) => setNewPost({ ...newPost, type: e.target.value as 'travel' | 'journal' })}
                      className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="travel">Travel Guide</option>
                      <option value="journal">Journal Entry</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-stone-600 mb-1">Image Source (URL or Upload)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newPost.image_url}
                        onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                        className="flex-1 px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="https://... or uploaded path"
                      />
                      <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg border border-stone-200 flex items-center gap-2 transition-all">
                        <Upload size={18} className={isUploading ? 'animate-bounce' : ''} />
                        <span className="text-sm font-medium whitespace-nowrap">{isUploading ? '...' : 'Upload'}</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Content (Markdown supported)</label>
                  <textarea 
                    required
                    rows={8}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 rounded-lg font-medium text-stone-600 hover:bg-stone-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
