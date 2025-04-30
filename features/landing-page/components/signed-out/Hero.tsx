// components/Hero.tsx
export default function Hero() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-54 shadow-sm transition-shadow duration-300 hover:shadow-lg"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgb(233, 244, 245)", // Fallback color
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
        className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600 hover:cursor-pointer"
      >
        Get Started
      </a>
    </div>
  );
}
