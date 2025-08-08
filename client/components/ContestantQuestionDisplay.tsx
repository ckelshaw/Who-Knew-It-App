import { useState } from "react";
import { Question } from "../../shared/classes/Question";
import { Textarea } from "./ui/textarea";
import type { FakeAnswer } from "../src/types/GuessRecord";

type CQDProps = {
    question: Question,
    roundNumber: number,
    questionNumber: number,
    submitAnswer: (answer: string) => void;
}

const ContestantQuestionDisplay = ( { question, questionNumber, submitAnswer }: CQDProps ) => {
    const [answer, setAnswer] = useState("");

    return (
      <>
        <div className="bg-white rounded-lg p-8 space-y-6">
          <div className="space-y-2">
            <div className="text-lg text-gray-500 tracking-wide uppercase">
              Question {questionNumber}
            </div>
            <h1 className="text-2xl tracking-tight text-gray-900">
              {question.question_text}
            </h1>
          </div>
          <div>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              rows={2}
              className="resize-none border-none border-b-2 border-gray-600 text-black"
            />
          </div>
          <button onClick={() => {submitAnswer(answer)}}>Submit</button>
        </div>
      </>
    );
};

export default ContestantQuestionDisplay;