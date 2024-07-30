"use client"

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { FaXTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa6';
import { SiPeerlist } from 'react-icons/si';
import { Filter, ChevronDown, SortAsc, SortDesc, Calendar, Clock, Trash2, Copy, ArrowBigLeft } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { Skeleton } from '@/components/ui/skeleton';
import useStore from '@/store/apiStore';
import { Pagination } from '../ui/pagination';
import { useSavedPostsStore } from '@/store/useSavePostStore';
import toast, { Toaster } from 'react-hot-toast';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import Link from 'next/link';

export default function SavedPosts() {
  const {
    savedPosts,
    currentPage,
    postsPerPage,
    sortColumn,
    sortDirection,
    searchTerm,
    loading,
    totalPosts,
    selectedPosts,
    fetchSavedPosts,
    setCurrentPage,
    setPostsPerPage,
    setSortColumn,
    setSortDirection,
    setSearchTerm,
    togglePostSelection,
    toggleSelectAll,
    deleteSelectedPosts,
  } = useSavedPostsStore();
  const { updatePost, fetchUserPosts } = useStore();
  const [editableContent, setEditableContent] = useState<{ [key: string]: any }>({});
  const [postType, setPostType] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const userId = useUser()?.user?.id;

  useEffect(() => {
    if (userId) {
      fetchSavedPosts(userId, { postType, dateFilter, sortColumn, sortDirection, searchTerm });
    }
  }, [userId, currentPage, postsPerPage, sortColumn, sortDirection, searchTerm, postType, dateFilter]);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  function truncateText(text: any, maxWords: any) {
    const wordsArray = text.split(' ');
    if (wordsArray.length > maxWords) {
      return wordsArray.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  }

  const handleContentChange = (postId: any, newContent: any) => {
    setEditableContent(prev => ({ ...prev, [postId]: newContent }));
  };

  const handleSaveChanges = async (postId: any) => {
    const newContent = editableContent[postId];
    if (newContent && userId) {
      await updatePost({ postId, postContent: newContent, user_id: userId });
      fetchSavedPosts(userId, { postType, dateFilter, sortColumn, sortDirection, searchTerm });
    }
  };

  const calculateTimeAgo = (createdAt: any) => {
    const now = dayjs();
    const createdDate = dayjs(createdAt);
    const daysAgo = now.diff(createdDate, 'day');
    const hoursAgo = now.diff(createdDate, 'hour');
    const minutesAgo = now.diff(createdDate, 'minute');

    if (daysAgo > 0) {
      return `${daysAgo} days ago`;
    } else if (hoursAgo > 0) {
      return `${hoursAgo} hours ago`;
    } else if (minutesAgo > 0) {
      return `${minutesAgo} minutes ago`;
    } else {
      return 'created recently';
    }
  };

  const handlePostTypeChange = (value: string) => {
    setPostType(value);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  const sortedPosts = [...savedPosts].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB.getTime() - dateA.getTime();
  });

  const handleCopyToClipboard = (content: any) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  }

  return (
    <React.Fragment>
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col gap-12">
            <div className="flex items-center justify-between flex-wrap">
              <div className='grid grid-cols-[0.3fr_1fr] items-center'>
              <Link href="/user/home">
                <ArrowBigLeft className="h-6 w-6 cursor-pointer" />
              </Link>
              <h1 className="text-2xl font-bold">Saved Posts</h1>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="end">
                    <Card>
                      <CardContent className="p-2">
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Post Type</p>
                            <Select onValueChange={handlePostTypeChange} defaultValue={postType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="xpost">Twitter</SelectItem>
                                <SelectItem value="linkedinpost">LinkedIn</SelectItem>
                                <SelectItem value="instagrampost">Instagram</SelectItem>
                                <SelectItem value="facebookpost">Facebook</SelectItem>
                                <SelectItem value="peerlist">Peerlist</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Date Filter</p>
                            <Select onValueChange={handleDateFilterChange} defaultValue={dateFilter}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select date range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All time</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">This week</SelectItem>
                                <SelectItem value="month">This month</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </PopoverContent>
                </Popover>
                <Button variant="outline" onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
                  {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-28 sm:w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedPosts.length === savedPosts.length && savedPosts.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-2 text-left">Post Title</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Created At</th>
                    <th className="p-2 text-left">Last Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td colSpan={5}>
                          <Skeleton className="h-12 w-full" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    sortedPosts.map((post) => (
                      <Sheet key={post.id}>
                        <SheetTrigger asChild>
                          <tr className="hover:bg-gray-100 cursor-pointer border-b">
                            <td className="p-2">
                              <input
                                type="checkbox"
                                checked={selectedPosts.includes(post.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  togglePostSelection(post.id);
                                }}
                              />
                            </td>
                            <td className="p-2">{truncateText(post.postContent, 10)}</td>
                            <td className="p-2">
                              {(() => {
                                switch (post.post_type) {
                                  case 'xpost':
                                  case 'twitter_thread':
                                    return <FaXTwitter className="text-black text-[24px]" />;
                                  case 'linkedinpost':
                                    return <FaLinkedin className="text-blue-700 text-[24px]" />;
                                  case 'instagrampost':
                                    return <FaInstagram className="text-pink-500 text-[24px]" />;
                                  case 'facebookpost':
                                    return <FaFacebook className="text-blue-600 text-[24px]" />;
                                  case 'peerlist':
                                    return <SiPeerlist className="text-green-500 text-[24px]" />;
                                  default:
                                    return 'Other';
                                }
                              })()}
                            </td>
                            <td className="p-2">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {dayjs(post.created_at).format('DD/MM/YYYY')}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {calculateTimeAgo(post.created_at)}
                              </div>
                            </td>
                          </tr>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="sm:max-w-xl mx-auto">
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-bold text-gray-900">Post Details</h2>
                              <Copy className="text-black text-2xl mt-6 cursor-pointer" onClick={handleCopyToClipboard} />
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                              <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-2">
                                Content
                              </label>
                              <Textarea
                                id="post-content"
                                value={editableContent[post.id] ?? post.postContent}
                                onChange={(e: any) => handleContentChange(post.id, e.target.value)}
                                className="w-full min-h-[150px] p-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500">Created At</p>
                                <p className="mt-1 text-sm text-gray-900">{dayjs(post.created_at).format('DD/MM/YYYY')}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">Last Created</p>
                                <p className="mt-1 text-sm text-gray-900">{calculateTimeAgo(post.created_at)}</p>
                              </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                              <Button onClick={() => handleSaveChanges(post.id)}>Save Changes</Button>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {
              sortedPosts.length <= 0 ?
                (
                  <div className="w-full grid justify-items-center">
                    Nothing here yet! Create your first post to see it appear.
                  </div>
                ) :
                (
                  <div className="flex items-center justify-between mt-4">
                    <Select
                      value={String(postsPerPage)}
                      onValueChange={(value: any) => setPostsPerPage(Number(value))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Posts per page" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 20, 50].map((value) => (
                          <SelectItem key={value} value={String(value)}>
                            {value} per page
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(totalPosts / postsPerPage)}
                      onPageChange={handlePageChange}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            onClick={() => deleteSelectedPosts(userId)}
                            disabled={selectedPosts.length === 0}
                          >
                            Delete Selected
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">
                          Delete selected posts
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )
            }
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </React.Fragment>
  );
}
