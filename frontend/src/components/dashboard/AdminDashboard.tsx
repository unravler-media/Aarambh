import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, FileText, TrendingUp, Settings, Eye, Trash2, Plus, Edit } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  const stats = {
    totalUsers: 1247,
    totalPosts: 89,
    totalViews: 25678,
    activeUsers: 342,
  };

  const recentUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'creator', joinedAt: '2024-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'member', joinedAt: '2024-01-14' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'creator', joinedAt: '2024-01-13' },
  ];

  const recentPosts = [
    { id: '1', title: 'Getting Started with React', author: 'John Doe', views: 1250, status: 'published' },
    { id: '2', title: 'Advanced TypeScript Tips', author: 'Jane Smith', views: 890, status: 'published' },
    { id: '3', title: 'Building Modern UIs', author: 'Mike Johnson', views: 567, status: 'draft' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
        </div>
        <Button className="bg-tech-red hover:bg-tech-red/90" onClick={() => navigate('/dashboard/posts/new')}>
          <Settings size={16} className="mr-2" />
          Platform Settings
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#2A2C36] pb-4">
        {['overview', 'users', 'posts', 'analytics'].map((tab) => (
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
                <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                <Users className="h-4 w-4 text-tech-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-green-400 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-tech-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
                <p className="text-xs text-green-400 mt-1">+8% from last month</p>
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
                <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
                <Users className="h-4 w-4 text-tech-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
                <p className="text-xs text-green-400 mt-1">+5% from last week</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader>
                <CardTitle className="text-white">Recent Users</CardTitle>
                <CardDescription className="text-gray-400">Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.role === 'creator' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{user.joinedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader>
                <CardTitle className="text-white">Recent Posts</CardTitle>
                <CardDescription className="text-gray-400">Latest content activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{post.title}</p>
                        <p className="text-sm text-gray-400">by {post.author}</p>
                      </div>
                      <div className="text-right ml-4">
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{post.views} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <Card className="bg-[#151619] border-[#2A2C36]">
          <CardHeader>
            <CardTitle className="text-white">User Management</CardTitle>
            <CardDescription className="text-gray-400">Manage all platform users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2A2C36]">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Role</TableHead>
                    <TableHead className="text-gray-400">Joined</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id} className="border-[#2A2C36]">
                      <TableCell className="text-white">{user.name}</TableCell>
                      <TableCell className="text-gray-400">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'creator' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">{user.joinedAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Eye size={16} />
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

      {activeTab === 'posts' && (
        <Card className="bg-[#151619] border-[#2A2C36]">
          <CardHeader>
            <CardTitle className="text-white">Content Management</CardTitle>
            <CardDescription className="text-gray-400">Manage all platform posts</CardDescription>
            <Button className="mt-3 bg-tech-red hover:bg-tech-red/90" onClick={() => navigate("/dashboard/posts/new")}>
              <Plus size={16} className="mr-2" />
              Add New Post
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2A2C36]">
                    <TableHead className="text-gray-400">Title</TableHead>
                    <TableHead className="text-gray-400">Author</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Views</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPosts.map((post) => (
                    <TableRow key={post.id} className="border-[#2A2C36]">
                      <TableCell className="text-white">{post.title}</TableCell>
                      <TableCell className="text-gray-400">{post.author}</TableCell>
                      <TableCell>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">{post.views.toLocaleString()}</TableCell>
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
    </div>
  );
};

export default AdminDashboard;

// This file is getting long (over 262 lines). You should consider asking me to refactor it into smaller components soon!
