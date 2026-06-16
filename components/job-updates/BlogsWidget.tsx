'use client';

import React from 'react';
import Link from 'next/link';
import { blogsData } from '@/data/blogsData';

export default function BlogsWidget() {
  return (
    <div className="mt-8 flex flex-col gap-6">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white px-2">
        Career Blogs
      </h3>
      
      {blogsData.map((blog) => (
        <div 
          key={blog.id} 
          className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Cover Image */}
          <div className="w-full h-40 relative overflow-hidden bg-slate-100 border-b border-slate-200 dark:border-white/10">
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Title Banner (Orange Strip) */}
            <div className="absolute bottom-4 -left-2 right-0 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 transform -skew-y-2 origin-left shadow-lg">
              {blog.title.toUpperCase()}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-5 flex flex-col gap-3">
            <h4 className="text-lg font-bold text-[#001D4A] dark:text-blue-100 leading-snug">
              {blog.title}
            </h4>
            
            <p className="text-sm text-[#7D8FA6] dark:text-slate-400 leading-relaxed line-clamp-4">
              {blog.snippet}
            </p>
            
            <Link 
              href={`/blogs/${blog.slug}`} 
              className="mt-1 text-[#224FFF] dark:text-blue-400 font-bold text-base hover:underline w-fit"
            >
              Read more
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
