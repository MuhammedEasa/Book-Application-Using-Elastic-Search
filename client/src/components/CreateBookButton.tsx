"use client";
import { useRouter } from "next/navigation";

const CreateBookButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/createBook");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded shadow-md transition duration-300"
    >
      Create Book
    </button>
  );
};

export default CreateBookButton;
