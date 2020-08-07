import { ApolloServer, gql } from "apollo-server-azure-functions";

const typeDefs = gql`
    type Query {
        graphQLOnAzure: String!
    }
`;
const resolvers = {
    Query: {
        graphQLOnAzure() {
            return "GraphQL on Azure!";
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
export default server.createHandler();