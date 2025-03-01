'use client';

export default function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="text-center">
      <h2 className="mb-4 mt-10 max-w-screen-xl px-5">Error: {error.message}</h2>
      <a
        href="/"
        className="mx-5 inline-flex items-center justify-center rounded-full border  border-transparent bg-sky-700 px-8 py-3 text-base font-medium leading-6 text-white shadow-md hover:bg-sky-600 focus:outline-none"
      >
        Back to Home
      </a>
    </div>
  );
}
