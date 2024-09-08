"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import SearchComponent from "@/components/SearchComponent";
import CreateBookButton from "@/components/CreateBookButton";
import { BookOpen, Search, PlusCircle, Library } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-purple-100 to-indigo-200">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold mb-4 md:mb-0 flex items-center">
            <BookOpen className="mr-2" />  Books Heaven
          </h1>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <SearchComponent />
            <CreateBookButton />
            <button
              onClick={() => router.push('/allBooks')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 flex items-center"
            >
              <Library className="mr-2" /> All Books
            </button>
          </div>
        </div>
      </header>
      
      <section className="container mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Welcome to Books Heaven</h2>
        <p className="text-gray-600 mb-6">
          Discover a world of stories, knowledge, and imagination. Our curated collection of books
          is designed to keep you engaged and inspired. Start your reading journey today!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Search className="text-indigo-500" size={24} />}
            title="Easy Search"
            description="Find your next favorite book with our powerful search feature."
          />
          <FeatureCard
            icon={<PlusCircle className="text-green-500" size={24} />}
            title="Add New Books"
            description="Contribute to our growing library by adding your own books."
          />
          <FeatureCard
            icon={<Library className="text-yellow-500" size={24} />}
            title="Explore All Books"
            description="Browse our entire collection and discover hidden gems."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-2 text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}