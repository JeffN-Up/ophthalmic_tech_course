import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { QuizData, QuizQuestion } from "@/components/ModuleQuiz";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";

interface CourseQuizProps {
  quiz: QuizData;
  onComplete: (score: number) => Promise<void> | void;
  onContinue: () => void;
}

function isCorrect(question: QuizQuestion, answer: string | undefined): boolean {
  if (!answer) return false;
  if (Array.isArray(question.correctAnswer)) {
    return question.correctAnswer.some(
      (candidate) => candidate.trim().toLowerCase() === answer.trim().toLowerCase(),
    );
  }
  return question.correctAnswer.trim().toLowerCase() === answer.trim().toLowerCase();
}

export default function CourseQuiz({ quiz, onComplete, onContinue }: CourseQuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const passed = score !== null && score >= quiz.passingScore;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const correctAnswers = quiz.questions.filter((question) =>
      isCorrect(question, answers[question.id]),
    ).length;
    const calculatedScore = Math.round((correctAnswers / quiz.questions.length) * 1000) / 10;
    setScore(calculatedScore);
    setSaving(true);
    try {
      await onComplete(calculatedScore);
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setAnswers({});
    setScore(null);
  };

  return (
    <Card className="p-6 text-slate-100 shadow-lg sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Knowledge Check</p>
        <h2 className="mt-1 text-3xl font-bold text-white">{quiz.title}</h2>
        <p className="mt-2 text-slate-200">{quiz.description}</p>
        <p className="mt-2 text-sm font-medium text-slate-300">Passing score: {quiz.passingScore}%</p>
      </div>

      {score !== null && (
        <div className={`mb-7 rounded-xl border p-5 ${passed ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
          <div className="flex items-center gap-3">
            {passed ? <CheckCircle2 className="h-8 w-8 text-green-600" /> : <XCircle className="h-8 w-8 text-amber-600" />}
            <div>
              <h3 className="text-xl font-bold text-slate-900">{passed ? "Nicely focused—knowledge check passed" : "Take another look, then try again"}</h3>
              <p className="text-slate-700">Score: {score}%</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="space-y-7">
        {quiz.questions.map((question, index) => {
          const answer = answers[question.id];
          const reviewed = score !== null;
          const correct = reviewed && isCorrect(question, answer);

          return (
            <fieldset key={question.id} className="rounded-xl border border-white/20 p-5">
              <legend className="px-2 font-bold text-white">{index + 1}. {question.question}</legend>

              {question.type === "multiple-choice" && question.options && (
                <div className="mt-4 space-y-3">
                  {question.options.map((option) => (
                    <label key={option} className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/20 p-3 hover:border-cyan-300">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answer === option}
                        disabled={reviewed}
                        onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                        className="mt-1"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === "true-false" && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {["True", "False"].map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/20 p-3 hover:border-cyan-300">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answer === option}
                        disabled={reviewed}
                        onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === "short-answer" && (
                <input
                  value={answer ?? ""}
                  disabled={reviewed}
                  onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                  className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3"
                  placeholder="Enter your answer"
                />
              )}

              {reviewed && (
                <div className={`mt-4 rounded-lg p-4 text-sm ${correct ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                  <p className="font-semibold">{correct ? "Correct" : `Correct answer: ${Array.isArray(question.correctAnswer) ? question.correctAnswer.join(", ") : question.correctAnswer}`}</p>
                  {question.explanation && <p className="mt-1">{question.explanation}</p>}
                </div>
              )}
            </fieldset>
          );
        })}

        {score === null ? (
          <Button
            type="submit"
            disabled={Object.keys(answers).length !== quiz.questions.length || saving}
            className="w-full bg-blue-600 py-6 text-white hover:bg-blue-700"
          >
            Check My Answers
          </Button>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="outline" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" /> Review & Retake
            </Button>
            <Button type="button" disabled={!passed || saving} onClick={onContinue} className="bg-green-600 text-white hover:bg-green-700">
              Continue to Next Module
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
}

