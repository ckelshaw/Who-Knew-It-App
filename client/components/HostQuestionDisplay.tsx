import React, { useEffect, useState } from 'react';
// import { DndContext, DragEndEvent } from '@dnd-kit/core'
// import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
import { Question } from '../../shared/classes/Question';
import { User } from '../../shared/classes/User';
import Select, { type MultiValue, type StylesConfig } from 'react-select';
import type { GuessRecord } from '../src/types/GuessRecord'
import Badge from './ui/Badge';
import { useSocket } from '../src/socket/socket-context';
// import type { Guess } from '../../shared/types/types';

type HQDProps = {
    allQuestionsIn: boolean
    question: Question;
    roundNumber: number | undefined;
    contestants: User[];
    questionNumber: number;
    submitSelections: (selections: GuessRecord[]) => void;
    advanceRound: () => void;
    lockInAnswers: () => void;
    showContestantsAnswer: (answerId: string) => void;
    showWriter: (answerId: string) => void;
}

type Option = {
    value: string;
    label: string;
}


const HostQuestionDisplay = ({ allQuestionsIn, question, roundNumber, contestants, questionNumber, submitSelections, advanceRound, lockInAnswers, showContestantsAnswer, showWriter }: HQDProps) => {
  const socket = useSocket();  
  const [selections, setSelections] = useState<GuessRecord[]>([]);
    const [disableLockInButton, setDisableLockInButton] = useState(false);
    const [showNextRoundBtn, setshowNextRoundBtn] = useState(false);
    const handleSelectChange = (answerId: string, newValue: MultiValue<Option>) => {
        const selectedUserIds = newValue.map(o => o.value); // users chosen for this answer

        setSelections(prev => {
            // 1) Remove any selection for these users from ALL answers (enforce uniqueness)
            const withoutChosenUsers = prev.filter(r => !selectedUserIds.includes(r.chosen_by));

            // 2) Remove old selections for this answer (we’re replacing them)
            const withoutThisAnswer = withoutChosenUsers.filter(r => r.answer_id !== answerId);

            // 3) Add the new selections for this answer
            const newRecords = selectedUserIds.map(userId => ({
            answer_id: answerId,
            chosen_by: userId,
            question_id: question.id
            }));

            return [...withoutThisAnswer, ...newRecords];
        });
    };

    useEffect(() => {
        const disableButton = () => {
            console.log("[host] Answers are locked");
            setDisableLockInButton(true);
        };

        socket?.on("answers_locked_in", disableButton);
    },[socket]);

    const userOptions: Option[] = contestants
      .filter((c: User) => c.role !== "host") // remove host
      .map((c: User) => ({
        value: c.userId,
        label: `${c.firstName} ${c.lastName}`,
      }));

    const usersById = React.useMemo(() => {
      const m = new Map<string, { playerName: string }>();
      contestants.forEach((u) => m.set(u.userId, { playerName: u.concattedName }));
      return m;
    }, [contestants]);

    const submitAnswers = (selections: GuessRecord[]) => {
        setshowNextRoundBtn(true);
        submitSelections(selections);
    }

    // Custom styles for react-select to match minimalist design
    const selectStyles: StylesConfig<Option, true> = {
      control: (provided, state) => ({
        ...provided,
        backgroundColor: 'rgb(249 250 251)',
        border: 'none',
        borderRadius: '8px',
        minHeight: '36px',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: 'rgb(243 244 246)',
        },
        ...(state.isFocused && {
          backgroundColor: 'rgb(243 244 246)',
          outline: '2px solid rgb(99 102 241)',
          outlineOffset: '2px',
        })
      }),
      valueContainer: (provided) => ({
        ...provided,
        padding: '4px 8px',
      }),
      placeholder: (provided) => ({
        ...provided,
        color: 'rgb(156 163 175)',
        fontSize: '14px',
      }),
      multiValue: (provided) => ({
        ...provided,
        backgroundColor: 'rgb(229 231 235)',
        borderRadius: '4px',
        margin: '2px',
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        fontSize: '13px',
        color: 'rgb(55 65 81)',
        padding: '2px 6px',
      }),
      multiValueRemove: (provided) => ({
        ...provided,
        color: 'rgb(107 114 128)',
        '&:hover': {
          backgroundColor: 'rgb(185 28 28)',
          color: 'white',
        },
      }),
      menu: (provided) => ({
        ...provided,
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected 
          ? 'rgb(99 102 241)' 
          : state.isFocused 
            ? 'rgb(243 244 246)' 
            : 'white',
        color: state.isSelected ? 'white' : 'rgb(55 65 81)',
        '&:active': {
          backgroundColor: 'rgb(99 102 241)',
          color: 'white',
        }
      }),
      indicatorSeparator: () => ({
        display: 'none',
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: 'rgb(156 163 175)',
        '&:hover': {
          color: 'rgb(107 114 128)',
        }
      }),
    };

    return (
      <div
        className={`space-y-8 mb-4 transition-opacity duration-300 ${
          roundNumber !== questionNumber ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="bg-white rounded-lg p-8 space-y-6">
          <div className="space-y-2">
            <div className="text-lg text-gray-500 tracking-wide uppercase">
              Question {questionNumber}
            </div>
            <h1 className="text-2xl tracking-tight text-gray-900">
              {question.question_text}
            </h1>
          </div>

          <div className="space-y-6">
            {question.answers.map((a, index) => {
              const submitterName =
                usersById.get(a.submitted_by)?.playerName ?? "The House";
              return (
                <div key={a.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-flex items-center justify-center w-6 h-6 text-sm text-gray-600 bg-gray-100 rounded-full flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-2xl text-left text-gray-600">
                          {a.answer_text}
                        </span>
                      </div>
                      <div className="text-sm text-left text-gray-500">
                        Submitted by {submitterName}
                      </div>
                    </div>
                    {a.correct && (
                      <div className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                        Correct Answer
                      </div>
                    )}
                    <Badge variant="clickable" className="text-xs" onClick={() => showContestantsAnswer(a.id)}>
                      Reveal Answer
                    </Badge>
                    <Badge variant="clickable" className="text-xs" onClick={() => showWriter(a.id)}>
                      Reveal Writer
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Players who selected this answer
                      </label>
                      <Select<Option, true>
                        isMulti
                        options={userOptions}
                        placeholder="Select players..."
                        styles={selectStyles}
                        className="text-sm"
                        value={userOptions.filter((opt) =>
                          selections.some(
                            (s) =>
                              s.answer_id === a.id && s.chosen_by === opt.value
                          )
                        )}
                        onChange={(nv) => handleSelectChange(a.id, nv)}
                      />
                    </div>

                    {a.notes && a.notes.trim().length > 0 && (
                      <details className="group">
                        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 transition-colors duration-150 select-none flex items-center space-x-2">
                          <span className="transition-transform duration-150 group-open:rotate-90 text-gray-400">
                            ▶
                          </span>
                          <span>Additional Notes</span>
                        </summary>
                        <div className="mt-3 ml-6 p-4 bg-gray-50 rounded-md text-sm text-gray-700 whitespace-pre-wrap">
                          {a.notes}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              );
            })}
            <details className="group" open>
              <summary className="cursor-pointer text-md text-gray-600 hover:text-gray-800 transition-colors duration-150 select-none flex items-center space-x-2">
                <span className="transition-transform duration-150 group-open:rotate-90 text-gray-400">
                  ▶
                </span>
                <span>Question Notes</span>
              </summary>
              <div className="mt-3 ml-6 p-4 bg-gray-50 rounded-md text-sm text-gray-700 whitespace-pre-wrap">
                {question.notes}
              </div>
            </details>
            {allQuestionsIn && (
              <button onClick={lockInAnswers} disabled={disableLockInButton} >Lock in Fake Answers</button>
            )}
            {selections.length === contestants.length - 1 && !showNextRoundBtn && (
              <button
                type="button"
                onClick={() => submitAnswers(selections)}
              >
                Submit Answers
              </button>
            )}
            {showNextRoundBtn && (
                <button onClick={advanceRound}>Next Round</button>
            )}
          </div>
        </div>
      </div>
      
    );
};

export default HostQuestionDisplay;