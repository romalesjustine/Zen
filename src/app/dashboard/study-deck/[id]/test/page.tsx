"use client";
import { Test } from "@/components/studydeck/[id]/test";
import { ChevronLeft, NotebookPen, PenLine, Layers } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import ScoreResult from "@/components/studydeck/[id]/score-result";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import RouteLoading from "@/components/loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface Question {
  choices: string[];
  question: string;
  answer: string;
  selectedAnswer: string;
}

export default function PracticeTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const id = pathname.split("/").filter(Boolean)[2];
  const router = useRouter();

  useEffect(() => {
    // Get questions from localStorage when component mounts
    const storedQuestions = localStorage.getItem("testQuestions");
    console.log("stored questions:", storedQuestions);
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
      setIsLoading(false);
      localStorage.removeItem("testQuestions");
    }
  }, [router]);

  if (isLoading || !questions || questions.length === 0) {
    return <RouteLoading />;
  }

  const handleAnswer = (answer: string) => {
    setQuestions(
      questions.map((question, index) => {
        if (index === currentQuestion) {
          return {
            ...question,
            selectedAnswer: answer,
          };
        }
        return question;
      })
    );
  };

  const handleSubmit = async () => {
    const allQuestionsAnswered = questions.every((q) => q.selectedAnswer);
    if (allQuestionsAnswered) {
      setShowResult(true);

      const score = questions.filter(
        (question) =>
          question.answer.toLowerCase() ===
          question.selectedAnswer.toLowerCase()
      ).length;
      console.log("score:", score);
      console.log("id:", id);

      try {
        await fetch("/api/exam-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            score: questions.filter(
              (question) =>
                question.answer.toLowerCase() ===
                question.selectedAnswer.toLowerCase()
            ).length,
          }),
        });
      } catch (error) {
        console.error("Error submitting score:", error);
      }
    } else {
      alert("Please answer all questions before submitting.");
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  return (
    <div className="w-full bg-result-gradient p-10">
      <div className="relative mb-8 flex w-full items-center justify-center">
        <div className="absolute left-0">
          <Link href={`/dashboard/study-deck/${id}`}>
            <ChevronLeft size={24} />
          </Link>
        </div>
        <h1 className="text-2xl">Practice Exam</h1>
      </div>
      {showResult ? (
        <ScoreResult totalQuestions={questions.length} questions={questions} />
      ) : (
        <Test
          id={id}
          questions={questions}
          handleAnswer={handleAnswer}
          handlePrevQuestion={handlePrevQuestion}
          currentQuestion={currentQuestion}
          handleNextQuestion={handleNextQuestion}
          handleSubmit={handleSubmit}
          isSubmitting={false}
        />
      )}
    </div>
  );
}
