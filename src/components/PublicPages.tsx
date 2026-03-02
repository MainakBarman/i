import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Mail, 
  Instagram, 
  Twitter, 
  Facebook,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { Post, Event } from '../types';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Travel', path: '/travel' },
    { name: 'Journal', path: '/journal' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Subscribe', path: '/subscribe' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                <Compass size={24} />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-stone-800">Navigator</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  location.pathname === link.path ? 'text-emerald-600' : 'text-stone-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/admin" 
              className="bg-stone-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-all"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-stone-600 hover:bg-stone-50 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium text-emerald-600"
              >
                Admin Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-stone-900 text-stone-300 py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white">
              <Compass size={20} />
            </div>
            <span className="text-xl font-serif font-bold text-white">Navigator</span>
          </div>
          <p className="text-stone-400 max-w-sm leading-relaxed">
            Exploring the world one story at a time. Join our community of digital nomads and travelers seeking authentic experiences.
          </p>
          <div className="flex space-x-4 mt-8">
            <a href="#" className="hover:text-emerald-500 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-emerald-500 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-emerald-500 transition-colors"><Facebook size={20} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/travel" className="hover:text-emerald-500 transition-colors">Travel Guides</Link></li>
            <li><Link to="/journal" className="hover:text-emerald-500 transition-colors">Daily Journal</Link></li>
            <li><Link to="/events" className="hover:text-emerald-500 transition-colors">Upcoming Events</Link></li>
            <li><Link to="/gallery" className="hover:text-emerald-500 transition-colors">Photo Gallery</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Newsletter</h4>
          <p className="text-sm text-stone-400 mb-4">Get the latest travel tips and stories delivered to your inbox.</p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-stone-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-emerald-500"
            />
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              <Mail size={18} />
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-stone-800 mt-16 pt-8 text-sm text-stone-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 Navigator. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-stone-300">Privacy Policy</a>
          <a href="#" className="hover:text-stone-300">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- Pages ---

export const Home = () => {
  const [featured, setFeatured] = useState<Post[]>([]);
  
  useEffect(() => {
    fetch('/api/posts?type=travel').then(res => res.json()).then(setFeatured);
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1 bg-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Adventure Awaits
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-8">
              Discover the Art of <span className="italic text-emerald-400">Slow Travel</span>
            </h1>
            <p className="text-xl text-stone-200 mb-10 leading-relaxed">
              Join a global community of explorers dedicated to authentic cultural immersion and sustainable adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/travel" className="bg-white text-stone-900 px-8 py-4 rounded-full font-bold hover:bg-stone-100 transition-all flex items-center justify-center gap-2">
                Explore Guides <ArrowRight size={20} />
              </Link>
              <Link to="/subscribe" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all text-center">
                Join Community
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Travel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-800">Featured Destinations</h2>
            <p className="text-stone-500 mt-2">Hand-picked guides for your next escape.</p>
          </div>
          <Link to="/travel" className="text-emerald-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.slice(0, 3).map((post, i) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                <img 
                  src={post.image_url || `https://picsum.photos/seed/${post.id}/800/1000`} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-800 uppercase">
                    Travel
                  </span>
                </div>
              </div>
              <Link to={`/post/${post.id}`}>
                <h3 className="text-xl font-serif font-bold text-stone-800 group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h3>
              </Link>
              <p className="text-stone-500 mt-2 line-clamp-2 text-sm leading-relaxed">
                {post.content.substring(0, 100)}...
              </p>
            </motion.div>
          ))}
          {featured.length === 0 && [1,2,3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-stone-200 rounded-2xl mb-4" />
              <div className="h-6 bg-stone-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-stone-200 rounded w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-emerald-900 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-serif font-bold mb-6">Ready for your next adventure?</h2>
          <p className="text-emerald-100 text-lg mb-10">
            Subscribe to our weekly newsletter and get exclusive travel tips, gear reviews, and hidden gems delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white text-emerald-900 px-8 py-4 rounded-full font-bold hover:bg-emerald-50 transition-all">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export const Travel = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    fetch('/api/posts?type=travel').then(res => res.json()).then(setPosts);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <header className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-stone-800 mb-6">Travel Guides</h1>
        <p className="text-stone-500 text-lg">Detailed itineraries, cultural insights, and practical tips for the modern nomad.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {posts.map((post) => (
          <article key={post.id} className="group">
            <div className="aspect-video rounded-3xl overflow-hidden mb-6 relative">
              <img 
                src={post.image_url || `https://picsum.photos/seed/${post.id}/1200/800`} 
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Guides</span>
              <span className="w-1 h-1 bg-stone-300 rounded-full" />
              <span className="text-xs text-stone-400">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <Link to={`/post/${post.id}`}>
              <h2 className="text-3xl font-serif font-bold text-stone-800 mb-4 group-hover:text-emerald-600 transition-colors">
                {post.title}
              </h2>
            </Link>
            <div className="text-stone-600 leading-relaxed mb-6 line-clamp-3">
              <Markdown>{post.content}</Markdown>
            </div>
            <Link to={`/post/${post.id}`} className="text-stone-900 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Read Guide <ArrowRight size={18} />
            </Link>
          </article>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-20 text-center text-stone-400">
            <Compass size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-serif italic">No guides published yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const Journal = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    fetch('/api/posts?type=journal').then(res => res.json()).then(setPosts);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <header className="mb-20">
        <h1 className="text-5xl font-serif font-bold text-stone-800 mb-4">The Daily Journal</h1>
        <p className="text-stone-500 text-lg">Raw thoughts, daily struggles, and small victories from life on the road.</p>
      </header>

      <div className="space-y-24">
        {posts.map((post) => (
          <article key={post.id} className="relative pl-12 border-l border-stone-200">
            <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-emerald-600 rounded-full" />
            <time className="block text-sm font-mono text-stone-400 mb-4 uppercase tracking-tighter">
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
            <Link to={`/post/${post.id}`}>
              <h2 className="text-3xl font-serif font-bold text-stone-800 mb-6 hover:text-emerald-600 transition-colors">{post.title}</h2>
            </Link>
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-96 object-cover rounded-2xl mb-8"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="markdown-body text-stone-700 leading-relaxed text-lg">
              <Markdown>{post.content}</Markdown>
            </div>
          </article>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <p className="text-xl font-serif italic">The journal is empty. The journey is just beginning.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    fetch('/api/events').then(res => res.json()).then(setEvents);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-serif font-bold text-stone-800 mb-4">Upcoming Events</h1>
          <p className="text-stone-500 text-lg">Meetups, workshops, and community gatherings for travelers and digital nomads.</p>
        </div>
        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
          <Calendar className="text-emerald-600" size={20} />
          <span className="text-emerald-800 font-medium">{events.length} Events Scheduled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex gap-8">
            <div className="flex-shrink-0 text-center">
              <div className="bg-stone-100 rounded-2xl p-4 w-20">
                <span className="block text-xs font-bold uppercase text-stone-400 mb-1">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="block text-3xl font-bold text-stone-800">
                  {new Date(event.date).getDate()}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold uppercase tracking-widest mb-2">
                <MapPin size={14} />
                {event.location}
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-800 mb-3">{event.title}</h3>
              <p className="text-stone-500 mb-6 leading-relaxed">{event.description}</p>
              <button className="bg-stone-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-stone-800 transition-all">
                RSVP Now
              </button>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="col-span-full bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl py-20 text-center text-stone-400">
            <p className="text-xl font-serif italic">No events currently scheduled. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const Gallery = () => {
  const photos = [
    { id: 1, url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800', title: 'Mountain Lake' },
    { id: 2, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800', title: 'Forest Path' },
    { id: 3, url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800', title: 'River Valley' },
    { id: 4, url: 'https://images.unsplash.com/photo-1433086566608-e9373f6672da?auto=format&fit=crop&q=80&w=800', title: 'Waterfall' },
    { id: 5, url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800', title: 'Coastal View' },
    { id: 6, url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=800', title: 'Desert Sunset' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <header className="mb-16">
        <h1 className="text-5xl font-serif font-bold text-stone-800 mb-4">Visual Journey</h1>
        <p className="text-stone-500 text-lg">Capturing moments of wonder from around the globe.</p>
      </header>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {photos.map((photo) => (
          <motion.div 
            key={photo.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="relative group rounded-2xl overflow-hidden shadow-sm"
          >
            <img 
              src={photo.url} 
              alt={photo.title} 
              className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <p className="text-white font-serif text-xl font-bold">{photo.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="bg-stone-900 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
          <h1 className="text-5xl font-serif font-bold text-white mb-8 leading-tight">
            Join the <span className="text-emerald-400 italic">Navigator</span> Inner Circle
          </h1>
          <p className="text-stone-400 text-lg mb-12 leading-relaxed">
            Get early access to travel guides, exclusive community meetups, and our curated monthly gear list. No spam, just pure inspiration.
          </p>
          
          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/20 border border-emerald-500/50 p-8 rounded-3xl text-center"
            >
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <Mail size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">You're on the list!</h3>
              <p className="text-emerald-100">Check your inbox for a welcome surprise.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" 
                  className="w-full bg-stone-800 border-none rounded-2xl px-8 py-6 text-white placeholder:text-stone-500 focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
                />
                <button 
                  disabled={status === 'loading'}
                  className="absolute right-2 top-2 bottom-2 bg-emerald-600 text-white px-8 rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
                >
                  {status === 'loading' ? 'Joining...' : 'Subscribe'}
                </button>
              </div>
              {status === 'error' && <p className="text-red-400 text-sm ml-4">Something went wrong. Please try again.</p>}
              <p className="text-stone-500 text-sm ml-4">By subscribing, you agree to our Privacy Policy.</p>
            </form>
          )}
        </div>
        <div className="lg:w-1/2 relative min-h-[400px]">
          <img 
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000" 
            alt="Nomad" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-transparent to-transparent lg:block hidden" />
        </div>
      </div>
    </div>
  );
};

export const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      });
    
    // Track view
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: `/post/${id}` })
    });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <Link to={post.type === 'travel' ? '/travel' : '/journal'} className="text-emerald-600 font-bold flex items-center gap-2 mb-10 hover:gap-3 transition-all">
        <ArrowRight size={18} className="rotate-180" /> Back to {post.type}
      </Link>
      
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">{post.type}</span>
          <span className="w-1 h-1 bg-stone-300 rounded-full" />
          <span className="text-xs text-stone-400">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <h1 className="text-5xl font-serif font-bold text-stone-800 mb-8 leading-tight">{post.title}</h1>
      </header>

      {post.image_url && (
        <img 
          src={post.image_url} 
          alt={post.title} 
          className="w-full h-[500px] object-cover rounded-[2rem] mb-12 shadow-xl"
          referrerPolicy="no-referrer"
        />
      )}

      <div className="markdown-body text-stone-700 leading-relaxed text-xl">
        <Markdown>{post.content}</Markdown>
      </div>
    </div>
  );
};

// --- Main Layout ---

export const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);
