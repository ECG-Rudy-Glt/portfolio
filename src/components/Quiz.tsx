import { useMemo, useState } from "react";

export interface QuizQuestion {
  domain: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Pioche `count` questions au hasard dans le pool, et mélange l'ordre des choix
// de chacune (en gardant la trace du bon index après mélange).
function drawRound(pool: QuizQuestion[], count: number) {
  return shuffle(pool)
    .slice(0, Math.min(count, pool.length))
    .map((q) => {
      const order = shuffle(q.choices.map((_, i) => i));
      return {
        ...q,
        choices: order.map((i) => q.choices[i]),
        correctIndex: order.indexOf(q.correctIndex),
      };
    });
}

export default function Quiz({ questions, count = 10 }: { questions: QuizQuestion[]; count?: number }) {
  const [round, setRound] = useState(() => drawRound(questions, count));
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => round.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0),
    [round, answers]
  );

  function pick(qIndex: number, choiceIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: choiceIndex }));
  }

  function restart() {
    setRound(drawRound(questions, count));
    setAnswers({});
    setSubmitted(false);
  }

  const allAnswered = round.every((_, i) => answers[i] !== undefined);

  return (
    <div className="mt-4 space-y-6">
      {submitted && (
        <div
          className="rounded-lg px-4 py-3 text-sm font-medium ring-1"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border)",
            color: "var(--fg)",
          }}
        >
          Score : {score} / {round.length}
        </div>
      )}

      {round.map((q, qIndex) => {
        const picked = answers[qIndex];
        return (
          <div
            key={qIndex}
            className="rounded-lg p-4 ring-1"
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
          >
            <p className="mb-1 text-xs font-medium" style={{ color: "var(--accent)" }}>
              {q.domain}
            </p>
            <p className="mb-3 text-sm font-medium" style={{ color: "var(--fg)" }}>
              {qIndex + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.choices.map((choice, cIndex) => {
                const isPicked = picked === cIndex;
                const isCorrect = submitted && cIndex === q.correctIndex;
                const isWrongPick = submitted && isPicked && cIndex !== q.correctIndex;
                return (
                  <button
                    key={cIndex}
                    type="button"
                    onClick={() => pick(qIndex, cIndex)}
                    disabled={submitted}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm ring-1 transition-colors"
                    style={{
                      borderColor: isCorrect
                        ? "#16a34a"
                        : isWrongPick
                          ? "#dc2626"
                          : "var(--border)",
                      background: isPicked && !submitted ? "var(--bg)" : "transparent",
                      color: "var(--fg)",
                      cursor: submitted ? "default" : "pointer",
                    }}
                  >
                    {choice}
                    {isCorrect && " ✓"}
                    {isWrongPick && " ✗"}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-3 text-xs" style={{ color: "var(--fg-muted)" }}>
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      <div className="flex gap-3">
        {!submitted ? (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className="rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            style={{ background: "var(--accent)" }}
          >
            Valider mes réponses
          </button>
        ) : (
          <button
            type="button"
            onClick={restart}
            className="rounded-md px-4 py-2 text-sm font-medium text-white"
            style={{ background: "var(--accent)" }}
          >
            Recommencer avec {count} nouvelles questions
          </button>
        )}
      </div>
    </div>
  );
}
