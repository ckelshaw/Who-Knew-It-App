export type GuessRecord = {
    answer_id: string;
    chosen_by: string;
    question_id: string;
}

export type FakeAnswer = {
    id: string;
    user_id: string | undefined;
    question_id: string;
    answer_text: string;
}