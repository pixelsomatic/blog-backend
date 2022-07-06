const axios = require("axios");
const app = require("express")();
const expressGraphql = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");
const cors = require('cors')

const schema = buildSchema(`
  type Posts {
    userId: Int
    id: Int
    title: String
    body: String
  }  
  type Query {
    posts: [Posts]!
    post(title: String!): [Posts]
  }
`)

const BASE_URL = 'https://www.scalablepath.com/api/test/test-posts'

const getBlogPosts = async () => {
  return await axios.get(BASE_URL).then((res) => res.data)
}

const getBlogPost = async (title) => {
  return await axios.get(BASE_URL).then((res) => res.data.filter((post) => post.title.includes(title.toLowerCase())))
}

var resolvers = {
  posts: async () => {
    return await getBlogPosts()
  },
  post: async (parent, args) => {
    return await getBlogPost(parent.title)
  }
}

app.use(cors())
app.use('/graphql', expressGraphql({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}))

app.listen(4000, () => console.log('Express GraphQL now running'))