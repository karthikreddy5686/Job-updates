import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { blogsData } from '@/data/blogsData';

export function generateStaticParams() {
  return blogsData.map((blog) => ({
    slug: blog.slug,
  }));
}

const renderWithLinks = (text: string | React.ReactNode) => {
  if (typeof text !== 'string') return text;
  
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    parts.push(
      <a 
        key={match.index} 
        href={match[2]} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-[#DEAF13] hover:text-[#b8910f] underline font-bold"
      >
        {match[1]}
      </a>
    );
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = blogsData.find((b) => b.slug === params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Navbar space filler if needed, assuming global nav exists */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10 flex items-center px-4 md:px-8">
         <Link href="/job-updates" className="text-sm font-semibold text-blue-600 hover:underline">
           &larr; Back to Job Updates
         </Link>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 bg-white dark:bg-slate-900 shadow-sm min-h-screen">
        
        {/* Banner Image */}
        <div className="w-full h-64 md:h-96 relative overflow-hidden rounded-xl mb-8">
          <Image 
            src={blog.coverImage} 
            alt={blog.title} 
            fill
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-6 md:bottom-10 -left-2 right-0 bg-orange-500 text-white text-xs md:text-sm font-bold uppercase tracking-widest py-3 px-6 transform -skew-y-2 origin-left shadow-xl">
            {blog.title.toUpperCase()}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#001D4A] dark:text-white mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Author & Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Image 
              src={blog.author.avatar} 
              alt={blog.author.name} 
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border border-slate-200 bg-slate-100"
            />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Posted by <span className="font-bold text-[#224FFF]">{blog.author.name}</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{blog.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400 font-medium">
            <span className="pr-2">{blog.readTime}</span>
          </div>
        </div>

        {/* Intro Snippet */}
        <p className="text-base md:text-lg text-[#334155] dark:text-slate-300 mb-8 leading-relaxed">
          {blog.snippet}
        </p>

        {/* Table of Contents */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-w-sm mb-10 overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Table of Contents</h3>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900">
            <ol className="list-decimal list-inside space-y-2 text-sm text-[#224FFF] dark:text-blue-400 font-medium">
              {blog.tableOfContents.map((item, idx) => (
                <li key={idx} className="hover:underline cursor-pointer">
                  <span className="text-slate-600 dark:text-slate-300">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="space-y-6">
          {blog.content.map((block, idx) => {
            if (block.type === 'h2') {
              return (
                <h2 key={idx} className="text-2xl font-bold text-[#001D4A] dark:text-white mt-10 mb-4">
                  {block.content}
                </h2>
              );
            }
            if (block.type === 'h3') {
              return (
                <h3 key={idx} className="text-xl font-bold text-[#001D4A] dark:text-white mt-8 mb-3">
                  {block.content}
                </h3>
              );
            }
            if (block.type === 'paragraph') {
              return (
                <p key={idx} className="text-base text-[#334155] dark:text-slate-300 leading-relaxed">
                  {renderWithLinks(block.content)}
                </p>
              );
            }
            if (block.type === 'table' && block.tableData) {
              return (
                <div key={idx} className="overflow-x-auto mt-6 mb-8 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        {block.tableData.headers.map((h, i) => (
                          <th key={i} className="px-4 py-3 font-bold text-[#001D4A] dark:text-white border-r last:border-r-0 border-slate-200 dark:border-slate-700 text-sm">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b last:border-b-0 border-slate-200 dark:border-slate-700">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-4 py-3 text-[#334155] dark:text-slate-300 text-sm border-r last:border-r-0 border-slate-200 dark:border-slate-700">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            return null;
          })}
        </div>
      </main>
    </div>
  );
}
