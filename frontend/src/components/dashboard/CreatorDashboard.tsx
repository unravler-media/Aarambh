import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, TrendingUp, Eye, Edit, Trash2, Plus, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  const stats = {
    totalPosts: 12,
    totalViews: 3456,
    totalLikes: 89,
    totalComments: 23,
  };

  const myPosts = [
    { id: '1', title: 'Getting Started with React', views: 1250, likes: 45, comments: 12, status: 'published', createdAt: '2024-01-15' },
    { id: '2', title: 'Advanced TypeScript Tips', views: 890, likes: 32, comments: 8, status: 'published', createdAt: '2024-01-10' },
    { id: '3', title: 'Building Modern UIs', views: 567, likes: 23, comments: 5, status: 'draft', createdAt: '2024-01-08' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Creator Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#2A2C36] text-gray-400 hover:text-white">
            <User size={16} className="mr-2" />
            Edit Profile
          </Button>
          <Button className="bg-tech-red hover:bg-tech-red/90" onClick={() => navigate("/dashboard/posts/new")}>
            <Plus size={16} className="mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#2A2C36] pb-4">
        {['overview', 'posts', 'profile'].map((tab) => (
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
                <CardTitle className="text-sm font-medium text-gray-400">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-tech-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
                <p className="text-xs text-green-400 mt-1">+2 this month</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Views</CardTitle>
                <TrendingUp className="h-4 w-4 text-tech-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-green-400 mt-1">+15% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Likes</CardTitle>
                <Eye className="h-4 w-4 text-tech-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalLikes}</div>
                <p className="text-xs text-green-400 mt-1">+8% from last week</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Comments</CardTitle>
                <FileText className="h-4 w-4 text-tech-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalComments}</div>
                <p className="text-xs text-green-400 mt-1">+3 this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Posts */}
          <Card className="bg-[#151619] border-[#2A2C36]">
            <CardHeader>
              <CardTitle className="text-white">Recent Posts</CardTitle>
              <CardDescription className="text-gray-400">Your latest content activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 rounded-lg bg-[#0A0B0F] border border-[#2A2C36]">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{post.title}</p>
                      <p className="text-sm text-gray-400">{post.views} views • {post.likes} likes • {post.comments} comments</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status}
                      </Badge>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white" onClick={() => navigate(`/dashboard/posts/${post.id}/edit`)}>
                        <Edit size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'posts' && (
        <Card className="bg-[#151619] border-[#2A2C36]">
          <CardHeader>
            <CardTitle className="text-white">My Posts</CardTitle>
            <CardDescription className="text-gray-400">Manage your published content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2A2C36]">
                    <TableHead className="text-gray-400">Title</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Views</TableHead>
                    <TableHead className="text-gray-400">Likes</TableHead>
                    <TableHead className="text-gray-400">Comments</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myPosts.map((post) => (
                    <TableRow key={post.id} className="border-[#2A2C36]">
                      <TableCell className="text-white">{post.title}</TableCell>
                      <TableCell>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">{post.views.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-400">{post.likes}</TableCell>
                      <TableCell className="text-gray-400">{post.comments}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Eye size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white" onClick={() => navigate(`/dashboard/posts/${post.id}/edit`)}>
                            <Edit size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

export default CreatorDashboard;

// This file is getting long (over 247 lines). You should consider asking me to refactor it into smaller components soon!
