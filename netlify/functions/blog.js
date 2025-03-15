const { MongoClient, ObjectId } = require('mongodb');
const marked = require('marked');
const sanitizeHtml = require('sanitize-html');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
  try {
    await client.connect();
    const database = client.db('portfolio');
    const posts = database.collection('blogposts');
    
    const method = event.httpMethod;
    const path = event.path.split('/').pop();
    
    switch (method) {
      case 'GET':
        if (path === 'blog') {
          const data = await posts.find({}).toArray();
          return {
            statusCode: 200,
            body: JSON.stringify(data)
          };
        } else {
          const post = await posts.findOne({ _id: ObjectId(path) });
          if (post) {
            // Convert markdown to HTML
            post.contentHtml = sanitizeHtml(marked(post.content));
            return {
              statusCode: 200,
              body: JSON.stringify(post)
            };
          } else {
            return {
              statusCode: 404,
              body: JSON.stringify({ error: 'Post not found' })
            };
          }
        }
      
      case 'POST':
        const newPost = JSON.parse(event.body);
        await posts.insertOne(newPost);
        return {
          statusCode: 201,
          body: JSON.stringify(newPost)
        };
        
      // Add PUT and DELETE methods
      
      default:
        return {
          statusCode: 405,
          body: 'Method Not Allowed'
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.close();
  }
};