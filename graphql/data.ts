import axios from "axios";

export type QuestionModel = {
    id: string;
    question: string;
    category: string;
    incorrect_answers: string[];
    correct_answer: string;
    type: string;
    difficulty: "easy" | "medium" | "hard";
};

interface DataStore {
    getQuestionById(id: string): Promise<QuestionModel>;
    getQuestions(): Promise<QuestionModel[]>;
}

class ApiDataStore implements DataStore {
    #data: QuestionModel[];
    #ensureData = async () => {
        if (!this.#data) {
            const { data } = await axios.get<{ results: QuestionModel[] }>("https://opentdb.com/api.php?amount=100&category=15&type=multiple")
            this.#data = data.results.map(q => ({ ...q, id: q.question.replace(" ", "") }));
        }
    }

    async getQuestionById(id: string): Promise<QuestionModel> {
        await this.#ensureData();
        return this.#data.find((q) => q.id === id);
    }
    async getQuestions(): Promise<QuestionModel[]> {
        await this.#ensureData();
        return this.#data;
    }
}

export const dataStore = new ApiDataStore();

export type Context = {
    dataStore: DataStore;
};