import SearchComponent from "@/components/SearchComponent";
import CreateBookButton from "@/components/CreateBookButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Book Library</h1>
          <div className="flex items-center space-x-4">
            <SearchComponent />
            <CreateBookButton />
          </div>
        </div>
      </header>
    </main>
  );
}
