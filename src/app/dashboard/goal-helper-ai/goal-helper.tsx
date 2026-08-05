"use client";
import React, { useState } from "react";
import { ArrowUp, Target } from "lucide-react";
import { cn, parseMarkdown } from "@/lib/utils";
import { Descendant } from "slate";
import EditorProvider from "@/providers/editor-provider";
import RichTextbox from "@/components/ui/rich-textbox";
import { Profile } from "@prisma/client";
import LoadingSpinner from "@/components/feedback/loading-spinner";
import { showErrorToast } from "@/lib/toast";
import { UsageLimitBanner } from "@/components/dashboard/usage-limit-banner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  parsed?: Descendant[];
}

const MAX_HISTORY_LENGTH = 6;

const createMessageId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
};

const GoalHelper = ({ profile }: { profile: Profile }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleClick = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      text: trimmedPrompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    const historyPayload = messages
      .slice(-MAX_HISTORY_LENGTH)
      .map((message) => ({
        role: message.role,
        content: message.text,
      }));

    try {
      const response = await fetch("/api/goal-helper/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          history: historyPayload,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message =
          errorBody?.message ?? "Failed to generate a response. Try again.";
        
        // Check if it's a subscription limit error
        if (response.status === 403) {
          showErrorToast(`${message} Upgrade to Premium for unlimited access!`);
          return;
        }
        
        throw new Error(message);
      }

      const data = await response.json();
      const answer = (data?.answer as string) ?? "";
      const parsedMarkdownText = await parseMarkdown(
        answer || "I could not generate a response this time."
      );

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        text: answer || "I could not generate a response this time.",
        parsed: parsedMarkdownText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Goal helper request failed:", error);
      showErrorToast("Something went wrong while getting a response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-fit w-full flex-col gap-4 rounded-xl p-8">
        <UsageLimitBanner />
        <div className="mb-4 flex flex-col items-center justify-center gap-4 p-2 pt-0">
          <div className="flex items-center gap-1">
            <p className="text-3xl font-bold text-black dark:text-white">Goal Helper AI</p>
            <Target className="h-8 w-8 text-black dark:text-white" />
          </div>
          <p className="text-3xl font-semibold text-black dark:text-white">
            Hi {profile.username}! How can I help you with your goal today?
          </p>
        </div>
        {/* <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-gray opacity-50">Suggested</p>
          <ul className="space-y-4 opacity-90">
            <li className="text-sm text-accent-100">
              Help me set a goal for today.
            </li>
            <li className="text-sm text-accent-100">
              I want to focus on a{" "}
              <span className="font-bold text-accent-200">goal</span> Can you
              help me break it down?
            </li>
            <li className="text-sm text-accent-100">
              Can you remind me of my goals for the month?
            </li>
            <li className="text-sm text-accent-100">
              How am I doing with my [goal]?
            </li>
            <li className="text-sm text-accent-100">
              Whats a good way to stay motivated today?
            </li>
          </ul>
        </div> */}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              `flex items-center gap-4`,
              message.role === "user"
                ? "w-fit max-w-[80%] flex-row-reverse self-end"
                : "w-fit flex-col"
            )}
          >
            {message.role === "assistant" && (
              <div className="flex w-full shrink-0 items-center justify-start gap-2 rounded-full">
                <Target className="h-8 w-8 text-black dark:text-white" />
                <p className="font-semibold text-black dark:text-white">Result</p>
              </div>
            )}
            <div
              className={cn(
                "flex-1 rounded-xl p-4 px-6",
                message.role === "user" ? "bg-[#591DA9] dark:bg-primary/10" : "ml-4 pt-0"
              )}
            >
              <div
                className={cn(
                  "prose prose-invert flex h-full w-full max-w-none items-center",
                  message.role === "user" ? "text-right" : "text-left"
                )}
              >
                {message.role === "assistant" && message.parsed ? (
                  <EditorProvider
                    contentValue={message.parsed}
                    changeContentValue={() => {}}
                  >
                    <RichTextbox className="!bg-transparent !p-0 dark:text-white text-black" readOnly />
                  </EditorProvider>
                ) : (
                  <p className="">{message.text}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 p-2 pt-0">
            <LoadingSpinner label="Thinking..." variant="light" />
          </div>
        )}
        {/* {isLoading && (
          <div className="flex items-center justify-center gap-2 p-2 pt-0">
            <p className="text-lg font-bold text-accent-200">Loading...</p>
          </div>
        )} */}
        {/* {result && (
          <div className="rounded-xl bg-primary/5 p-4">
            <div className="prose prose-invert max-w-none transition-all">
              <ReactMarkdown className={"transition-all"}>
                {result}
              </ReactMarkdown>
            </div>
          </div>
        )} */}
        <div className="duration-400 flex h-fit justify-between gap-4 rounded-[999px] border dark:border-primary/20 border-[#591DA9] bg-white dark:bg-transparent dark:bg-gradient-to-br from-primary/15 to-[#051960]/0 px-6 py-3 text-sm transition-all focus-within:border-primary/50">
          <textarea
            // type="text"
            onChange={(e) => setPrompt(e.target.value)}
            className="h-[36px] max-h-[200px] w-full dark:text-gray text-black resize-none border-none bg-transparent p-2 text-sm outline-none"
            value={prompt}
            placeholder="Ask anything to help with your goal..."
          />
          <button
            onClick={handleClick}
            className="rounded-full bg-gradient-1 px-2 py-2 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isLoading || !prompt.trim()}
          >
            <ArrowUp className="h-5 w-5 dark:text-white text-black" />
            {/* <p className="font-bold text-accent-200">Submit</p> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalHelper;
