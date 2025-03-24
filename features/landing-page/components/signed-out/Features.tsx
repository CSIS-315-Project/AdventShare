// components/Features.tsx
const features = [
  {
    title: "Share Resources",
    description:
      "AdventShare is a platform for schools to donate and claim educational resources and equipment.",
    bgColor: "bg-blue-50",
  },
  {
    title: "Save Budget",
    description:
      "Reduce costs by claiming items from other schools instead of buying new.",
    bgColor: "bg-green-50",
  },
  {
    title: "Build Community",
    description:
      "Create lasting partnerships with other schools in your area through resource sharing.",
    bgColor: "bg-purple-50",
  },
];

export default function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div key={index} className={`p-6 ${feature.bgColor} rounded-lg`}>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
