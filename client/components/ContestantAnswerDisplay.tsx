import { Question } from '../../shared/classes/Question';
import { User } from '../../shared/classes/User';
// import { useState } from 'react';

type CADProps = {
    question: Question;
    roundNumber: number | undefined;
    questionNumber: number;
    answerToShow: Array<string>;
    writerToShow: Array<string>;
    contestants: Array<User>;
}

const ContestantQuestionDisplay = ({ question, roundNumber, questionNumber, answerToShow, writerToShow, contestants }: CADProps) => {

  console.log("Answer to show: ", answerToShow);

    return (
    <>
      <div
        className={`space-y-8 mb-4 transition-opacity duration-300 ${
          roundNumber !== questionNumber ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="bg-white rounded-lg p-8 space-y-6">
          <div className="space-y-2">
            <div className="text-lg text-gray-500 tracking-wide uppercase">
              Question {questionNumber} (ContestantAnswerDisplay)
            </div>
            <h1 className="text-2xl tracking-tight text-gray-900">
              {question.question_text}
            </h1>
          </div>

          <div className="space-y-6">
            {question.answers.map((a, index) => {
              const submitterName = contestants.find(c => c.userId === a.submitted_by)?.concattedName ?? "Unknown";
              return (
                <div key={a.id}>
                  {answerToShow.length === 0 && (
                    <p>Lets go through the answers...</p>
                  )}
                  {/* {answerToShow.length > 0 && answerToShow.includes(a.id) && ( */}
                    <div key={a.id}>
                  {answerToShow.length === 0 && (
                    <p>Lets go through the answers...</p>
                  )}
                  {answerToShow.length > 0 && answerToShow.includes(a.id) && (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="inline-flex items-center justify-center w-6 h-6 text-sm text-gray-600 bg-gray-100 rounded-full flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-2xl text-left text-gray-600">
                              {a.answer_text}
                            </span>
                            {a.correct && writerToShow.includes(a.id) && (
                              <div className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                                Correct Answer
                              </div>
                            )}
                          </div>
                          {writerToShow.includes(a.id) && (
                            <p className="text-gray-500">
                              Written by: {submitterName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                  {/* )} */}
                </div>
                
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContestantQuestionDisplay;
