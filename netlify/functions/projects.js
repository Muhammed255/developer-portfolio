const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

exports.handler = async (event, context) => {
  try {
    await client.connect();
    const database = client.db('portfolio');
    const projects = database.collection('projects');
    
    const method = event.httpMethod;
    
    switch (method) {
      case 'GET':
        const data = await projects.find({}).toArray();
        return {
          statusCode: 200,
          body: JSON.stringify(data)
        };
      
      case 'POST':
        const newProject = JSON.parse(event.body);
        await projects.insertOne(newProject);
        return {
          statusCode: 201,
          body: JSON.stringify(newProject)
        };
        
      // Add PUT and DELETE methods similarly
      
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