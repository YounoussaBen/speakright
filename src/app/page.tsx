import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <main className="px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
          <Image
            className="dark:invert"
            src="/logo.png"
            alt="logo"
            width={180}
            height={38}
            priority
          />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            SpeakRight
          </span>
        </div>
      </main>
    </div>
  );
}
