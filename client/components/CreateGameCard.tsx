import React, {useState, useEffect, useReducer } from "react";
import { gameReducer, initialGameState } from '../reducers/gameReducer';
import UserMultiSelect from '../components/UserMultiSelect';
import { User } from '../../shared/classes/User';
import { Question } from "../../shared/classes/Question";
import { Answer } from "../../shared/classes/Answer";
//import Button from '../components/ui/Button';

type rawUser = {
  user_id: string,
  first_name: string,
  last_name: string,
  nickname: string
}

type NewAnswerInput = {
  text: string,
  isCorrect: boolean
}

const CreateGameCard = () => {
  const [game, dispatch] = useReducer(gameReducer, initialGameState);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [isAddingAnswers, setIsAddingAnswers] = useState(false);
  const [answerInputs, setAnswerInputs] = useState<NewAnswerInput[]>([{ text: '', isCorrect: false}])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_NAME', payload: e.target.value});
  };
  const handleAddContestant = (user: User) => {
    dispatch({ type: 'ADD_CONTESTANT', payload: user});
  };

  const startAddingAnswers = () => {
    if(questionText.trim() !== '') {
      setIsAddingAnswers(true);
    }
  }

  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...answerInputs];
    updated[index].text = value;
    setAnswerInputs(updated);
  }

  const handleToggleCorrect = (index: number) => {
    const updated = [...answerInputs];
    updated[index].isCorrect = !updated[index].isCorrect;
    setAnswerInputs(updated);
  }

  const addNewAnswerField = () => {
    setAnswerInputs((prev) => [...prev, { text: '', isCorrect: false}]);
  }

  const handleSaveQuestionAndAnswers = () => {
    if(!questionText.trim()) return;

    const questionID = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const q = new Question(questionID, game.game_id, questionText.trim(), "House", createdAt, []);

    const answers = answerInputs
      .filter((a) => a.text.trim() !== '')
      .map((a) => new Answer(crypto.randomUUID(), questionID, a.text.trim(), "House", a.isCorrect, createdAt));

    q.answers = answers;
    dispatch({ type: 'ADD_QUESTION', payload: q});

    setQuestionText('');
    setAnswerInputs([{ text: '', isCorrect: false }]);
    setIsAddingAnswers(false);
    console.log(game);
  }

  const handleSetContestants = (userIds: string[]) => {
    const newUsers = allUsers.filter((user) => {
      const alreadyAdded = game.contestants.some((c) => c.userId === user.userId);
      return userIds.includes(user.userId) && !alreadyAdded;
    });

    newUsers.forEach((u) => {
      handleAddContestant(u);
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const rawData = await res.json();
        const userInstances = rawData.map((u: rawUser) =>
          new User(u.user_id, u.first_name, u.last_name, u.nickname ?? '')
        );

        setAllUsers(userInstances);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error fetching users');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <div className="p-4">
        <input
          type="text"
          placeholder="Game Name"
          value={game.name}
          onChange={handleNameChange}
          className="border p-2 rounded"
        />

        <p className="mt-2">Status: {game.game_status}</p>
        <p>Created: {new Date(game.created_at).toLocaleString()}</p>

        <h3 className="mt-4 font-semibold">Contestants</h3>
        <UserMultiSelect
          users={allUsers}
          selected={game.contestants.map((u) => u.userId)}
          onChange={handleSetContestants}
        />
        <ul>
          {game.contestants.map((u) => (
            <li key={u.userId}>
              {u.nickname ?? `${u.firstName} ${u.lastName}`}
            </li>
          ))}
        </ul>

        <h3 className="mt-4 font-semibold">Create Question</h3>

        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question..."
          rows={2}
          className="w-full p-2 border rounded resize-none"
        />

        {!isAddingAnswers && (
          <button
            type="button"
            onClick={startAddingAnswers}
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
          >
            Start Adding Answers
          </button>
        )}

        {isAddingAnswers && (
          <div className="mt-4 space-y-2">
            {answerInputs.map((a, idx) => (
              <div key={idx} className="mb-3">
                <textarea
                  value={a.text}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  placeholder={`Answer ${idx + 1}`}
                  rows={2}
                  className="w-full p-2 border rounded resize-none"
                />
                <label className="flex items-center mt-1 text-sm">
                  <input
                    type="checkbox"
                    checked={a.isCorrect}
                    onChange={() => handleToggleCorrect(idx)}
                    className="mr-2"
                  />
                  Mark as Correct
                </label>
              </div>
            ))}

            <button
              type="button"
              onClick={addNewAnswerField}
              className="px-4 py-1 bg-gray-300 rounded"
            >
              Add Another Answer
            </button>

            <button
              type="button"
              onClick={handleSaveQuestionAndAnswers}
              className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
            >
              Add Question & Answers
            </button>
          </div>
        )}
        {/* Existing questions */}
        {game.questions.length > 0 && (
          <div className="space-y-2">
            <label>Added Questions ({game.questions.length})</label>
            {game.questions.map((question) => (
              <div
                key={question.id}
                className="border rounded-lg p-3 bg-muted/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <p>{question.question_text}</p>
                  {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      className="h-auto p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button> */}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Answers:</strong>{" "}
                  {question.answers.map((a) => (
                    <span key={a.id} className={a.correct ? "font-bold" : ""}>{a.answer_text}, </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {game.questions.length > 0 && (
          <button type="button">Save Game</button>
        )}
      </div>
    </>
  );
};

export default CreateGameCard;