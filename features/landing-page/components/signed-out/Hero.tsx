// components/Hero.tsx
export default function Hero() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-24 rounded-lg"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(255, 255, 215, 0.9)", // Fallback color
      }}
    >
      <h1 className="text-4xl font-bold text-white">Welcome to AdventShare!</h1>
      <p className="mt-2 text-2xl text-white" style={{ color: "#003B5C" }}>
        Give What You Don't Need, Claim What You Do!
      </p>
      <p className="mt-2 text-lg text-white" style={{ color: "#003B5C" }}>
        Join our community of schools sharing resources and saving money.
      </p>
      <a
        href="/onboarding"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer"
      >
        Get Started
      </a>
    </div>
  );
}
