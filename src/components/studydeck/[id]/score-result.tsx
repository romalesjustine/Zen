import ResultCard from "./result-card";
import StatsCard from "./stats-card";
import CircleProgress from "./circle-progress";

interface ScoreResultProps {
  totalQuestions: number;
  questions: {
    question: string;
    choices: string[];
    answer: string;
    selectedAnswer: string;
  }[];
}

export default function ScoreResult({
  totalQuestions,
  questions,
}: ScoreResultProps) {
  const score = questions.filter(
    (question) =>
      question.answer.toLowerCase() === question.selectedAnswer.toLowerCase()
  ).length;
  const isPassed = score >= totalQuestions * 0.75;

  return (
    <div className="w-full h-full">
      <div className="w-full min-h-screen flex justify-center pt-14">
        <div>
          <ResultCard
            isPassed={isPassed}
            score={score}
            totalQuestions={totalQuestions}
          />
          <div className="flex items-center gap-8 mt-8">
            <div
              className="w-[180px] h-[150px] rounded-[30px] flex items-center justify-center"
              style={{
                backgroundColor: "rgba(6, 2, 19, 0.10)",
                boxShadow:
                  "0px 5px 25px 0px #6A34B2 inset, 0px 72px 96px 0px #120622 inset, 0px 3px 9px 0px rgba(89, 29, 169, 0.10) inset",
              }}
            >
              <CircleProgress progress={(score / totalQuestions) * 100} />
            </div>
            <StatsCard value={score} label="Correct" isCorrect={isPassed} />
            <StatsCard value={totalQuestions - score} label="Incorrect" />
          </div>
        </div>
      </div>
      <div className="mt-32 px-12 space-y-8">
        {questions.map((question, index) => (
          <div className="space-y-6" key={index}>
            <div className="flex justify-end">
              <p className="text-lg text-white">
                {question.selectedAnswer === question.answer ? "1" : "0"}/1
              </p>
            </div>
            <div
              className="w-full max-h-fit bg-flashcard-gradient min-h-[140px]
                            rounded-xl shadow-lg p-8 flex items-center justify-center border border-[#591DA9]"
            >
              <p className="text-2xl font-medium text-white">
                {question.question}
              </p>
            </div>
            <div className="min-h-[140px] flex items-center w-full">
              {question.choices.length === 0 ? (
                <div className="bg-transparent border-2 border-[#591DA9] text-white resize-none text-2xl font-normal w-full py-4 whitespace-pre-wrap break-words placeholder:text-[#C0B4D0] outline-none focus:outline-none focus:ring-0 focus:border-[#591DA9] rounded-xl px-4">
                  <div className="flex justify-between w-full gap-4">
                    <div
                      className={`flex-1 p-2 rounded-xl ${
                        question.selectedAnswer === question.answer
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      <div className="text-sm text-gray-200 mb-2">
                        Your Answer:
                      </div>
                      <div className="text-xl">{question.selectedAnswer}</div>
                    </div>
                    <div className="flex-1 p-2 rounded-xl bg-green-600">
                      <div className="text-sm text-gray-200 mb-2">
                        Correct Answer:
                      </div>
                      <div className="text-xl">{question.answer}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid-cols-2 grid gap-5 w-full">
                  {question.choices.map((choice, index) => (
                    <div
                      key={index}
                      className={`w-full p-4 text-xl rounded-xl text-white transition-colors ${
                        choice === question.selectedAnswer
                          ? choice === question.answer
                            ? "bg-green-600"
                            : "bg-red-600"
                          : choice === question.answer
                          ? "bg-green-600"
                          : "bg-[#591DA9]"
                      }`}
                    >
                      {choice}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
