import { ApolloServer, gql } from "apollo-server-azure-functions";
import { dataStore, Context } from "./data";

const typeDefs = gql`
    type Quiz {
        id: String!
        question: String!
        correctAnswer: String!
        incorrectAnswers: [String!]!
    }

    type TriviaQuery {
        quizzes: [Quiz!]!
        quiz(id: String!): Quiz!
    }

    schema {
        query: TriviaQuery
    }
`;

const resolvers = {
    TriviaQuery: {
        quizzes: async (parent, args, context: Context, info) => {
            const questions = await context.dataStore.getQuestions();
            return questions;
        },

        quiz: async (parent, { id }, { dataStore }: Context) => {
            return await dataStore.getQuestionById(id);
        }
    },

    Quiz: {
        correctAnswer: parent => {
            return parent.correct_answer;
        },

        incorrectAnswers: parent => {
            return parent.incorrect_answers;
        }
    }
};

const server = new ApolloServer({
    typeDefs, resolvers, context: {
        dataStore
    }
});
export default server.createHandler();