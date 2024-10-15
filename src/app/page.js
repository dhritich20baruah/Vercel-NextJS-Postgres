import { pool } from "@/utils/dbConnect";
import dbConnect from "@/utils/dbConnect";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  return (
    <main className="p-10 bg-black flex justify-center items-center w-full h-screen ">
      <div className="flex-col space-y-4">
        <div>
          <Link href="/notes">
            <button className="p-2 w-28 text-white bg-cyan-700">Notes</button>
          </Link>
        </div>
        <div>
          <Link href="/tesseract">
            <button className="p-2 w-28 text-white bg-cyan-700">
              Tesseract
            </button>
          </Link>
        </div>
        <div>
          <Link href="/openAPI">
            <button className="p-2 w-28 text-white bg-cyan-700">OpenAPI</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
