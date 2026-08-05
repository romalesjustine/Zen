interface QuestionComponentProps {
  question: string;
  choices: string[];
  selectedAnswer: string;
  onAnswer: (answer: string) => void;
}

export default function QuestionComponent({
  question,
  choices,
  selectedAnswer,
  onAnswer,
}: QuestionComponentProps) {
  return (
    <div className="space-y-6">
      <div
        className="w-full h-full bg-flashcard-gradient min-h-96
                rounded-xl shadow-lg p-8 flex items-center justify-center border border-[#591DA9]"
      >
        <p className="text-2xl font-medium text-white">{question}</p>
      </div>
      <div className="min-h-[140px] flex items-center w-full">
        {choices.length === 0 ? (
          <input
            type="text"
            value={selectedAnswer}
            className="bg-transparent border-2 border-[#591DA9] text-white resize-none text-2xl font-normal w-full py-4 whitespace-pre-wrap break-words placeholder:text-[#C0B4D0] outline-none focus:outline-none focus:ring-0 focus:border-[#591DA9] rounded-xl px-4"
            placeholder="Enter your answer"
            onChange={(e) => onAnswer(e.target.value)}
            onBlur={(e) => onAnswer(e.target.value)}
          />
        ) : (
          <div className="grid-cols-2 grid gap-5 w-full">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => onAnswer(choice)}
                className={`w-full ${
                  selectedAnswer === choice
                    ? "bg-green-600 hover:bg-green-400/80"
                    : "bg-[#591DA9]"
                } p-4 text-xl rounded-xl text-white hover:bg-[#6929c4] transition-colors`}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
