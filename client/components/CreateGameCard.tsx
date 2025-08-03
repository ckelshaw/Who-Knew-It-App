import React, { useState, useEffect, useReducer } from "react";
import { gameReducer, initialGameState } from '../reducers/gameReducer';
import UserMultiSelect from '../components/UserMultiSelect';
import { User } from '../../shared/classes/User';
import { Question } from "../../shared/classes/Question";
import { Answer } from "../../shared/classes/Answer";
import { Input } from "./ui/input";
import Button from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import Badge from "./ui/Badge";
import { Plus } from "lucide-react";

type rawUser = {
  user_id: string,
  first_name: string,
  last_name: string,
  nickname: string
}

type NewAnswerInput = {
  text: string,
  isCorrect: boolean,
  notes: string
}

const CreateGameCard = () => {
  const [game, dispatch] = useReducer(gameReducer, initialGameState);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [questionNoteText, setQuestionNoteText] = useState('');
  const [isAddingAnswers, setIsAddingAnswers] = useState(false);
  const [answerInputs, setAnswerInputs] = useState<NewAnswerInput[]>([{ text: '', isCorrect: false, notes: '' }]);
  const [theHouse, setTheHouse] = useState<User>();

  const saveGame = async () => {
  console.log("game to be saved: ", game);
  try {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save game.');
    }

    const { game_id } = await res.json();
    alert(`Game saved! ID: ${game_id}`);
  } catch (error) {
    console.error('Error saving game:', error);
    alert('Error saving game!');
  }
};

  const resetGame = () => {
    console.log("game before: ", game);
    dispatch({ type: 'RESET_GAME', payload: '' });
    setQuestionText('');
    setIsAddingAnswers(false);
    setAnswerInputs([{ text: '', isCorrect: false, notes: '' }]);
    console.log("game after: ", game);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_NAME', payload: e.target.value });
  };

  const handleAddContestant = (user: User) => {
    dispatch({ type: 'ADD_CONTESTANT', payload: user });
  };

  const startAddingAnswers = () => {
    if (questionText.trim() !== '') {
      setIsAddingAnswers(true);
    }
  }

  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...answerInputs];
    updated[index].text = value;
    setAnswerInputs(updated);
  }

  const handleAnswerNoteChange = (index: number, value: string) => {
    const updated = [...answerInputs];
    updated[index].notes = value;
    setAnswerInputs(updated);
  }

  const handleToggleCorrect = (index: number) => {
    setAnswerInputs((prev) =>
      prev.map((a, i) => ({
        ...a,
        isCorrect: i === index,
      }))
    );
  }

  const addNewAnswerField = () => {
    setAnswerInputs((prev) => [...prev, { text: '', isCorrect: false, notes: '' }]);
  }

  const handleSaveQuestionAndAnswers = () => {
    if (!questionText.trim()) return;

    const questionID = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const q = new Question(questionID, game.game_id || '', questionText.trim(), theHouse?.userId ?? '', createdAt, [], '');

    const answers = answerInputs
      .filter((a) => a.text.trim() !== '')
      .map((a) => new Answer(crypto.randomUUID(), questionID, a.text.trim(), theHouse?.userId ?? '', a.isCorrect, createdAt, a.notes));

    q.answers = answers;
    q.notes = questionNoteText;
    dispatch({ type: 'ADD_QUESTION', payload: q });

    setQuestionText('');
    setAnswerInputs([{ text: '', isCorrect: false, notes: '' }]);
    setQuestionNoteText('');
    setIsAddingAnswers(false);
    console.log(game);
  }

  const handleSetContestants = (userIds: string[]) => {
    const newUsers = allUsers.filter((user) => {
      const alreadyAdded = (game.contestants || []).some((c) => c.userId === user.userId);
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

        userInstances.forEach(user => {
            if(user.first_name === 'Matt' && user.last_name === "Stewart"){
                setTheHouse(new User(user.user_id, user.first_name, user.last_name, user.nickname ?? ''));
            }
        });

        setAllUsers(userInstances);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error('Error fetching users');
        }
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full">
      <div>
        <h2 className="mb-4">Create a New Game</h2>
        
        {/* Game Name */}
        <div className="space-y-3 mb-4">
          <Label htmlFor="game-name">Game Name</Label>
          <Input
            id="game-name"
            type="text"
            placeholder="Enter game name"
            value={game.name || ''}
            onChange={handleNameChange}
            className="text-lg py-3"
          />
        </div>

        {/* Game Status */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <Badge variant="outline" className="text-xs">
              {game.game_status || 'New'}
            </Badge>
          </div>
          <div>
            Created: {game.created_at ? new Date(game.created_at).toLocaleString() : 'Just now'}
          </div>
        </div>
      </div>

      {/* Contestants */}
      <div className="space-y-4">
        <Label>Contestants</Label>
        <UserMultiSelect
          users={allUsers}
          selected={(game.contestants || []).map((u) => u.userId)}
          onChange={handleSetContestants}
        />
        {(game.contestants || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(game.contestants || []).map((u) => (
              <div key={u.userId} className="bg-muted px-3 py-1 rounded-full text-sm">
                <Badge variant="outline">
                    {u.concattedName}
                </Badge>
                
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <Label>Questions</Label>

        {/* Question Input */}
        <div className="space-y-4">
          <Textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question..."
            rows={2}
            className="resize-none"
          />
          <Textarea
            value={questionNoteText}
            onChange={(e) => setQuestionNoteText(e.target.value)}
            placeholder="Enter notes for this question..."
            rows={3}
            className="resize-none"
          />

          {!isAddingAnswers && (
            <Button
              type="button"
              onClick={startAddingAnswers}
              disabled={!questionText.trim()}
              variant="outline"
            >
              Add Answers
            </Button>
          )}

          {isAddingAnswers && (
            <div className="space-y-6 pt-4">
              <div className="space-y-4">
                {answerInputs.map((a, idx) => (
                  <div key={idx} className="space-y-3 bg-muted/30 p-4 rounded-lg">
                    <Textarea
                      value={a.text}
                      onChange={(e) => handleAnswerChange(idx, e.target.value)}
                      placeholder={`Answer ${idx + 1}`}
                      rows={2}
                      className="resize-none bg-background"
                    />
                    <Input
                      value={a.notes}
                      type="text"
                      onChange={(e) => handleAnswerNoteChange(idx, e.target.value)}
                      placeholder="Enter notes for this answer..."
                      className="bg-background"
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={a.isCorrect}
                        onChange={() => handleToggleCorrect(idx)}
                        className="w-4 h-4 text-primary"
                      />
                      <Label className="text-sm cursor-pointer" onClick={() => handleToggleCorrect(idx)}>
                        Correct Answer
                      </Label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewAnswerField}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Answer
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveQuestionAndAnswers}
                  disabled={!questionText.trim() || !answerInputs.some(a => a.text.trim())}
                >
                  Save Question
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Existing Questions */}
      {(game.questions || []).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Added Questions</Label>
            <Badge variant="secondary" className="text-xs">
              {(game.questions || []).length}
            </Badge>
          </div>
          <div className="space-y-6">
            {(game.questions || []).map((question, index) => (
              <div key={question.id} className="pb-6 border-b border-border/50 last:border-0 last:pb-0">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm font-medium min-w-[2rem] text-center">
                      {index + 1}
                    </div>
                    <p className="flex-1">{question.question_text}</p>
                  </div>
                  
                  <div className="ml-11 space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Answers: </span>
                      {(question.answers || []).map((a, answerIndex) => (
                        <span key={a.id} className={a.correct ? "font-medium" : "text-muted-foreground"}>
                          {a.answer_text}
                          {answerIndex < (question.answers || []).length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                    {question.notes && (
                      <div className="text-sm text-muted-foreground">
                        <span>Notes: </span>{question.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6">
        {(game.questions || []).length > 0 && (
          <Button type="button" className="flex-1" onClick={saveGame}>
            Save Game
          </Button>
        )}
        <Button type="button" variant="outline" onClick={resetGame}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default CreateGameCard;