import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AboutUs() {
  const team = [
    { role: "Project Manager", members: ["Abuela, Charles Andrei C."] },
    {
      role: "Business Analyst / Requirements Engineer",
      members: ["Alano, Ruzel Luigi"],
    },
    { role: "UI/UX", members: ["Villalobos, Kristine Faye L."] },
    {
      role: "Frontend Developer",
      members: ["Romales, Justine Carl R.", "Jara, Francine Nastassja P."],
    },
    {
      role: "Backend Developer",
      members: ["Montemayor, Keith Reijay M.", "Maisog, Rodney M."],
    },
    { role: "Quality Assurance", members: ["Reyes, Arwen Angelique C."] },
    {
      role: "Documentation",
      members: ["Quijano, Katherine P.", "Lalis, Reygine S."],
    },
  ];

  return (
    <main className="min-h-screen bg-[#00020A] text-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          About Zen
        </h1>
        <p className="mt-6 text-xl text-[#ECECECA6] max-w-3xl mx-auto">
          Zen is an AI-first study companion designed to handle the
          administrative burden of learning, letting students focus on mastery
          and flow.
        </p>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-gradient-to-b from-[#00020A] via-[#591DA9]/10 to-[#00020A]">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-[#CB98ED] mb-6">
              Our Vision
            </h2>
            <p className="text-lg text-[#ECECECA6] leading-relaxed">
              We aim to revolutionize the study experience by integrating Google
              Gemini-powered intelligence directly into your workflow. From OCR
              ingestion to spaced-repetition flashcards, Zen is built for the
              modern student.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-[#CB98ED] mb-6">
              Core Features
            </h2>
            <ul className="space-y-3 text-[#ECECECA6]">
              <li>• AI-powered notes and automated flashcard generation</li>
              <li>• Goal Helper Chat using RAG and Supabase pgvector</li>
              <li>• OCR + embeddings pipeline for PDF/DOCX uploads</li>
              <li>• Motivational Weekly Wrap analytics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#CB98ED] to-[#591DA9] bg-clip-text text-transparent">
          The Team Behind Zen
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((item, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#CB98ED]/50 transition-colors"
            >
              <h3 className="text-[#CB98ED] font-bold text-sm uppercase tracking-widest mb-4">
                {item.role}
              </h3>
              <div className="space-y-2">
                {item.members.map((member, mIndex) => (
                  <p key={mIndex} className="text-xl font-medium text-white">
                    {member}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
