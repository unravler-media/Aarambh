
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Bookmark, MessageCircle, User, Eye } from 'lucide-react';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with actual API calls
  const stats = {
    totalLikes: 45,
    totalComments: 23,
    savedPosts: 12,
    postsRead: 89,
  };

  const likedPosts = [
    { id: '1', title: 'Getting Started with React', author: 'John Doe', likedAt: '2024-01-15' },
    { id: '2', title: 'Advanced TypeScript Tips', author: 'Jane Smith', likedAt: '2024-01-14' },
    { id: '3', title: 'Building Modern UIs', author: 'Mike Johnson', likedAt: '2024-01-13' },
  ];

  const savedPosts = [
    { id: '1', title: 'CSS Grid Layout Guide', author: 'Sarah Wilson', savedAt: '2024-01-12' },
    { id: '2', title: 'JavaScript Best Practices', author: 'Tom Brown', savedAt: '2024-01-11' },
    { id: '3', title: 'React Performance Tips', author: 'Lisa Davis', savedAt: '2024-01-10' },
  ];

  const recentComments = [
    { id: '1', post: 'Getting Started with React', comment: 'Great tutorial! Very helpful.', commentedAt: '2024-01-15' },
    { id: '2', post: 'Advanced TypeScript Tips', comment: 'Thanks for sharing these tips.', commentedAt: '2024-01-14' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Member Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
        </div>
        <Button variant="outline" className="border-[#2A2C36] text-gray-400 hover:text-white">
          <User size={16} className="mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#2A2C36] pb-4">
        {['overview', 'liked', 'saved', 'comments', 'profile'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'bg-tech-red hover:bg-tech-red/90' : 'text-gray-400 hover:text-white'}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Posts Liked</CardTitle>
                <Heart className="h-4 w-4 text-tech-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalLikes}</div>
                <p className="text-xs text-green-400 mt-1">+5 this week</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Comments</CardTitle>
                <MessageCircle className="h-4 w-4 text-tech-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalComments}</div>
                <p className="text-xs text-green-400 mt-1">+3 this week</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Saved Posts</CardTitle>
                <Bookmark className="h-4 w-4 text-tech-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.savedPosts}</div>
                <p className="text-xs text-green-400 mt-1">+2 this month</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Posts Read</CardTitle>
                <Eye className="h-4 w-4 text-tech-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.postsRead}</div>
                <p className="text-xs text-green-400 mt-1">+12 this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader>
                <CardTitle className="text-white">Recently Liked</CardTitle>
                <CardDescription className="text-gray-400">Posts you've liked recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {likedPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{post.title}</p>
                        <p className="text-sm text-gray-400">by {post.author}</p>
                      </div>
                      <div className="text-right ml-4">
                        <Heart size={16} className="text-tech-red" />
                        <p className="text-xs text-gray-500 mt-1">{post.likedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader>
                <CardTitle className="text-white">Saved Posts</CardTitle>
                <CardDescription className="text-gray-400">Posts you've bookmarked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{post.title}</p>
                        <p className="text-sm text-gray-400">by {post.author}</p>
                      </div>
                      <div className="text-right ml-4">
                        <Bookmark size={16} className="text-tech-red" />
                        <p className="text-xs text-gray-500 mt-1">{post.savedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'liked' && (
        <Card className="bg-[#151619] border-[#2A2C36]">
          <CardHeader>
            <CardTitle className="text-white">Liked Posts</CardTitle>
            <CardDescription className="text-gray-400">All posts you've liked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {likedPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-lg bg-[#0A0B0F] border border-[#2A2C36]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium">{post.title}</h3>
                      <p className="text-sm text-gray-400">by {post.author} • Liked on {post.likedAt}</p>
                    </div>
                    <Heart size={20} className="text-tech-red ml-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'saved' && (
        <Card className="bg-[#151619] border-[#2A2C36]">
          <CardHeader>
            <CardTitle className="text-white">Saved Posts</CardTitle>
            <CardDescription className="text-gray-400">Your bookmarked posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-lg bg-[#0A0B0F] border border-[#2A2C36]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium">{post.title}</h3>
                      <p className="text-sm text-gray-400">by {post.author} • Saved on {post.savedAt}</p>
                    </div>
                    <Bookmark size={20} className="text-tech-red ml-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'comments' && (
        <Card className="bg-[#151619] border-[#2A2C36]">
          <CardHeader>
            <CardTitle className="text-white">My Comments</CardTitle>
            <CardDescription className="text-gray-400">Comments you've made on posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComments.map((comment) => (
                <div key={comment.id} className="p-4 rounded-lg bg-[#0A0B0F] border border-[#2A2C36]">
                  <div className="space-y-2">
                    <h3 className="text-white font-medium">{comment.post}</h3>
                    <p className="text-gray-300">{comment.comment}</p>
                    <p className="text-sm text-gray-500">Commented on {comment.commentedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'profile' && (
        <Card className="bg-[#151619] border-[#2A2C36]">
          <CardHeader>
            <CardTitle className="text-white">Profile Settings</CardTitle>
            <CardDescription className="text-gray-400">Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-tech-red rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{user?.name}</h3>
                  <p className="text-gray-400">{user?.email}</p>
                  <Badge className="mt-2">{user?.role}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Full Name</label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2A2C36] rounded-md text-white focus:border-tech-red"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2A2C36] rounded-md text-white focus:border-tech-red"
                    readOnly
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-gray-400 text-sm">Bio</label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2A2C36] rounded-md text-white focus:border-tech-red h-24"
                  />
                </div>
              </div>
              <Button className="bg-tech-red hover:bg-tech-red/90">
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemberDashboard;
