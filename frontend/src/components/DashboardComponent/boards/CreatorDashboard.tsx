import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, TrendingUp, Eye, Edit, Trash2, Plus, User, X } from 'lucide-react';
import { useDashboard } from '@/hooks/creatorDashboard';
import Layout from '@/components/layout';
import UserSats from './userStats.tsx';


const CreatorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { dashboard, loading, error } = useDashboard();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    username: user?.username || '',
    role: user?.role || '',
  });

  const handleProfileUpdate = () => {
    // Handle profile update logic here
    console.log('Profile updated:', profileData);
    setShowProfileModal(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <Layout>
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-[#151619] rounded-xl w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-[#151619] rounded-xl"></div>)}
        </div>
        <div className="h-12 bg-[#151619] rounded-xl w-1/3 mt-10"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-72 bg-[#151619] rounded-xl"></div>)}
        </div>
      </div>
    </Layout>;

  }

  if (error) {
    return <Layout>
      <div className="text-center py-12">
        <p className="text-red-400">Error loading posts: {error}</p>
      </div>
    </Layout>;
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Creator Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-[#2A2C36] text-gray-400 hover:text-white hover:cursor-pointer"
            onClick={() => setShowProfileModal(true)}>
            <User size={16} className="mr-2" />
            Edit Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-400/90 hover:cursor-pointer"
            onClick={() => window.location.href = "/dashboard/posts/new"}>
            <Plus size={16} className="mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0B0F] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <Card className="bg-[#151619] border-[#2A2C36] border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-white">Profile Settings</CardTitle>
                  <CardDescription className="text-gray-400">Update your profile information</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20  rounded-full flex items-center justify-center">
                      { /* TODO: add conditional in future if user has a profile show it otherwise show this */},
                      <User size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{user?.name}</h3>
                      <p className="text-gray-400">{user?.email} - {user?.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm">Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2A2C36] rounded-md text-white focus:border-red-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm">Username</label>
                      <input
                        type="email"
                        value={profileData.username}
                        className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2A2C36] rounded-md text-white focus:border-red-400 cursor-not-allowed"
                        readOnly
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 text-sm">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2A2C36] rounded-md text-white focus:border-red-400 cursor-not-allowed"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleProfileUpdate}
                      className="bg-red-400 hover:bg-red-400/90 text-white"
                    >
                      Update Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowProfileModal(false)}
                      className="border-[#2A2C36] text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}


      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#2A2C36] pb-4">
        {['overview', 'posts', 'profile'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'text-white hover:text-gray-400 hover:cursor-pointer' : 'text-gray-400 hover:text-white hover:cursor-pointer'}
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
                <FileText className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboard?.total_posts}</div>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Views on Posts</CardTitle>
                <TrendingUp className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboard?.total_views}</div>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Likes on Posts</CardTitle>
                <Eye className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboard?.total_likes}</div>
              </CardContent>
            </Card>
            <Card className="bg-[#151619] border-[#2A2C36]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Comments on Posts</CardTitle>
                <FileText className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboard?.total_comments}</div>
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
                {dashboard?.recent_posts.map((post) => (
                  <div key={post.slug} className="flex items-center justify-between p-4 rounded-lg bg-[#0A0B0F] border border-[#2A2C36]">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{post.post_title}</p>
                      <p className="text-sm text-gray-400">{post.views_count} views • {post.likes_count} likes • {post.comments_count} comments</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        <p className='text-gray-400'>{post.status}</p>
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                        onClick={() => window.location.href = `/dashboard/posts/${post.slug}/edit`}>
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
                  {dashboard?.recent_posts?.map((post) => (
                    <TableRow key={post.slug} className="border-[#2A2C36]">
                      <TableCell className="text-white">{post.post_title}</TableCell>
                      <TableCell>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          <p className='text-gray-400'>{post.status}</p>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">{post.views_count}</TableCell>
                      <TableCell className="text-gray-400">{post.likes_count}</TableCell>
                      <TableCell className="text-gray-400">{post.comments_count}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:cursor-pointer"
                            onClick={() => window.location.href = `/posts/${post.slug}`}>
                            <Eye size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:cursor-pointer"
                            onClick={() => window.location.href = `/dashboard/posts/${post.slug}/edit`}>
                            <Edit size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:cursor-pointer">
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
        <UserSats />
      )}

    </div>
  );
};

export default CreatorDashboard;

// This file is getting long (over 247 lines). You should consider asking me to refactor it into smaller components soon!
