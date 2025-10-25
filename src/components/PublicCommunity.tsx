import { useState } from "react";
import { MessageCircle, Heart, Share2, TrendingUp, Users, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  category: "insight" | "success" | "question" | "tip";
  title: string;
  content: string;
  likes: number;
  comments: Comment[];
  tags: string[];
}

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: "Sarah Mitchell",
    avatar: "SM",
    timestamp: "2 hours ago",
    category: "success",
    title: "Finally broke through my procrastination habit!",
    content: "After 3 GROW sessions, I realized my procrastination wasn't about laziness—it was fear of imperfection. I started using the '5-minute rule': just commit to 5 minutes of work. Usually, I keep going after that. This simple shift has transformed my productivity!",
    likes: 24,
    tags: ["productivity", "mindset", "breakthrough"],
    comments: [
      {
        id: "c1",
        author: "James Chen",
        content: "This is brilliant! I've been struggling with the same issue. Going to try the 5-minute rule today.",
        timestamp: "1 hour ago",
        likes: 5
      },
      {
        id: "c2",
        author: "Emma Rodriguez",
        content: "The fear of imperfection resonates so much with me. Thank you for sharing this!",
        timestamp: "45 minutes ago",
        likes: 3
      }
    ]
  },
  {
    id: "2",
    author: "Marcus Johnson",
    avatar: "MJ",
    timestamp: "5 hours ago",
    category: "insight",
    title: "The power of asking 'What's really stopping me?'",
    content: "During my coaching session, the coach kept asking 'What's really stopping you?' instead of 'What's stopping you?' That tiny word 'really' made me dig deeper. I discovered my obstacle wasn't time—it was my belief that I needed permission to pursue my goals. Game changer.",
    likes: 42,
    tags: ["self-awareness", "limiting-beliefs", "coaching"],
    comments: [
      {
        id: "c3",
        author: "Lisa Park",
        content: "Wow, this question just hit me hard. I think I've been waiting for permission too. Thank you!",
        timestamp: "3 hours ago",
        likes: 8
      },
      {
        id: "c4",
        author: "David Thompson",
        content: "This is exactly what I needed to hear today. Sometimes we're our own biggest obstacle.",
        timestamp: "2 hours ago",
        likes: 4
      },
      {
        id: "c5",
        author: "Priya Sharma",
        content: "I love how one word can change everything. Going to use this in my own reflection.",
        timestamp: "1 hour ago",
        likes: 2
      }
    ]
  },
  {
    id: "3",
    author: "Alex Rivera",
    avatar: "AR",
    timestamp: "1 day ago",
    category: "tip",
    title: "My weekly reflection ritual that changed everything",
    content: "Every Sunday evening, I spend 30 minutes reviewing my week using these 3 questions: 1) What worked? 2) What didn't? 3) What will I do differently? I write it down in a journal. This simple practice has helped me stay accountable and learn from every experience. Highly recommend!",
    likes: 67,
    tags: ["reflection", "habits", "accountability"],
    comments: [
      {
        id: "c6",
        author: "Rachel Green",
        content: "I've been looking for a simple reflection framework. This is perfect!",
        timestamp: "18 hours ago",
        likes: 6
      },
      {
        id: "c7",
        author: "Tom Wilson",
        content: "Do you use a physical journal or digital? I'm trying to decide which works better.",
        timestamp: "12 hours ago",
        likes: 2
      },
      {
        id: "c8",
        author: "Alex Rivera",
        content: "@Tom I use a physical journal. There's something about writing by hand that helps me process better. But do what feels right for you!",
        timestamp: "10 hours ago",
        likes: 4
      }
    ]
  },
  {
    id: "4",
    author: "Nina Patel",
    avatar: "NP",
    timestamp: "2 days ago",
    category: "question",
    title: "How do you handle setbacks without losing motivation?",
    content: "I had a great action plan from my last session, but life threw some curveballs and I couldn't follow through. Now I'm feeling demotivated. How do you all bounce back when things don't go as planned?",
    likes: 31,
    tags: ["motivation", "resilience", "setbacks"],
    comments: [
      {
        id: "c9",
        author: "Carlos Mendez",
        content: "I remind myself that setbacks are data, not failure. They tell me what to adjust, not that I should quit.",
        timestamp: "1 day ago",
        likes: 12
      },
      {
        id: "c10",
        author: "Sophie Laurent",
        content: "I've learned to have 'Plan B' actions that are smaller and more flexible. When life gets crazy, I switch to those instead of abandoning everything.",
        timestamp: "1 day ago",
        likes: 9
      },
      {
        id: "c11",
        author: "Nina Patel",
        content: "Thank you both! The 'setbacks are data' mindset is really helpful. And I love the Plan B idea!",
        timestamp: "20 hours ago",
        likes: 5
      }
    ]
  },
  {
    id: "5",
    author: "Jordan Lee",
    avatar: "JL",
    timestamp: "3 days ago",
    category: "success",
    title: "Celebrated my first 'no' today!",
    content: "I've always been a people pleaser. Today, I said 'no' to a project that didn't align with my goals. It felt scary but empowering. My GROW session helped me realize that every 'yes' to something misaligned is a 'no' to my priorities. Small win, but it feels huge!",
    likes: 89,
    tags: ["boundaries", "priorities", "growth"],
    comments: [
      {
        id: "c12",
        author: "Maya Anderson",
        content: "This is such an important skill! Congratulations on honoring your priorities. 🎉",
        timestamp: "2 days ago",
        likes: 7
      },
      {
        id: "c13",
        author: "Ryan Foster",
        content: "Every yes to something misaligned is a no to my priorities' - I'm writing this down!",
        timestamp: "2 days ago",
        likes: 11
      }
    ]
  }
];

const CATEGORY_CONFIG = {
  insight: { icon: Lightbulb, color: "text-yellow-600", bg: "bg-yellow-50", label: "Insight" },
  success: { icon: TrendingUp, color: "text-green-600", bg: "bg-green-50", label: "Success Story" },
  question: { icon: MessageCircle, color: "text-blue-600", bg: "bg-blue-50", label: "Question" },
  tip: { icon: Users, color: "text-purple-600", bg: "bg-purple-50", label: "Tip" }
};

export function PublicCommunity() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<Post["category"]>("insight");
  const [newPostAuthor, setNewPostAuthor] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentAuthors, setCommentAuthors] = useState<Record<string, string>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment =>
            comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
          )
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string) => {
    const content = commentInputs[postId]?.trim() ?? "";
    const author = (commentAuthors[postId]?.trim() ?? "").length > 0 ? commentAuthors[postId]?.trim() ?? "Anonymous" : "Anonymous";
    
    if (content.length === 0) {
      return;
    }

    const newComment: Comment = {
      id: `c${Date.now()}`,
      author,
      content,
      timestamp: "Just now",
      likes: 0
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setCommentInputs({ ...commentInputs, [postId]: "" });
    setCommentAuthors({ ...commentAuthors, [postId]: "" });
  };

  const handleCreatePost = () => {
    if (newPostTitle.trim().length === 0 || newPostContent.trim().length === 0) {
      return;
    }

    const newPost: Post = {
      id: `${Date.now()}`,
      author: newPostAuthor.trim().length > 0 ? newPostAuthor.trim() : "Anonymous",
      avatar: (newPostAuthor.trim().length > 0 ? newPostAuthor.trim() : "Anonymous").split(" ").map(n => n[0]).join("").toUpperCase(),
      timestamp: "Just now",
      category: newPostCategory,
      title: newPostTitle,
      content: newPostContent,
      likes: 0,
      comments: [],
      tags: []
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostAuthor("");
    setShowNewPostForm(false);
  };

  const toggleComments = (postId: string) => {
    setExpandedPosts({
      ...expandedPosts,
      [postId]: expandedPosts[postId] === true ? false : true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Go to homepage"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              CoachFlux
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/community"
              className="text-violet-600 dark:text-violet-400 font-medium"
            >
              Community
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mt-16 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Insights</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Share your journey, learn from others</p>
            </div>
            <button
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all font-medium"
            >
              Share Your Story
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* New Post Form */}
        {showNewPostForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Share with the Community</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name (optional)</label>
                <input
                  type="text"
                  value={newPostAuthor}
                  onChange={(e) => setNewPostAuthor(e.target.value)}
                  placeholder="Anonymous"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(CATEGORY_CONFIG) as Array<Post["category"]>).map((cat) => {
                    const config = CATEGORY_CONFIG[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => setNewPostCategory(cat)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          newPostCategory === cat
                            ? `${config.bg} ${config.color} ring-2 ring-offset-1 ring-current`
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="What's your story?"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Share Your Experience</label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What worked for you? What did you learn? Share your insights..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreatePost}
                  disabled={newPostTitle.trim().length === 0 || newPostContent.trim().length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Post to Community
                </button>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => {
            const config = CATEGORY_CONFIG[post.category];
            const Icon = config.icon;
            const isExpanded = expandedPosts[post.id] === true;

            return (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                {/* Post Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {post.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{post.author}</h3>
                        <span className="text-gray-400 dark:text-gray-500">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.timestamp}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} flex items-center gap-1`}>
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2">{post.title}</h2>
                      <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">{post.content}</p>
                      
                      {post.tags.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {post.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">{post.likes}</span>
                    </button>
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">{post.comments.length}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">Share</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Comments ({post.comments.length})</h3>
                    
                    {/* Existing Comments */}
                    <div className="space-y-4 mb-6">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {comment.author.split(" ").map(n => n[0]).join("").toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-white">{comment.author}</span>
                                <span className="text-gray-400 dark:text-gray-500">•</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>
                              <button
                                onClick={() => handleLikeComment(post.id, comment.id)}
                                className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors mt-2 text-sm"
                              >
                                <Heart className="w-4 h-4" />
                                <span>{comment.likes > 0 ? comment.likes : "Like"}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                      <input
                        type="text"
                        value={commentAuthors[post.id] ?? ""}
                        onChange={(e) => setCommentAuthors({ ...commentAuthors, [post.id]: e.target.value })}
                        placeholder="Your name (optional)"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent mb-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <textarea
                        value={commentInputs[post.id] ?? ""}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        placeholder="Share your thoughts..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={(commentInputs[post.id]?.trim() ?? "").length === 0}
                        className="mt-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:shadow-lg hover:shadow-violet-500/30 transition-all font-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">Join the conversation • Share what works • Learn from others</p>
        </div>
      </div>
    </div>
  );
}
