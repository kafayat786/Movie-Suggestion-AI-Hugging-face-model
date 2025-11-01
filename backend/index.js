const express = require('express');
const { ObjectId } = require('mongodb');
const cors = require('cors');
const { getCollection, closeConn, connectToMongo } = require('./db');
const { getEmbeddings } = require('./getHuggingFaceEmbedding');
const app = express();
require('dotenv').config();
const port = 3000;

app.use(cors())
app.use(express.json());

app.get('/ping', (req, res) => {
    res.json({
        message: 'pong',
        timestamp: new Date().toISOString()
    });
});


app.get('/movies/search', async (req, res) => {
    try {
        console.log("---------", req.query)
        const { query } = req.query;
        console.log('query->', query);
        const plot_embedding = await getEmbeddings(query);
        console.log('movie->', plot_embedding.length);
        const collection = await getCollection('sample_movies_v1')
        const aggregationPipeline = await getAggregationPipeline(plot_embedding);
        const movies = await collection
            .aggregate(aggregationPipeline)
            .toArray();

        res.json({
            data: movies
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error:)',
            error: error.message
        });
    }
})

app.get('/movies/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const collection = await getCollection('sample_movies_v1');
        const movie = await collection.findOne(
            { _id: new ObjectId(movieId) },
            { projection: { plot_embedding: 0 } }
        );

        if (!movie) {
            return res.status(404).json({
                message: 'Movie not found'
            });
        }

        res.json({
            data: movie
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
})

app.get('/movies', async (req, res) => {
    try {
        // Extract pagination parameters from query string
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;

        if (page < 1) {
            return res.status(400).json({
                message: 'Page number must be greater than 0'
            });
        }
        if (limit < 1 || limit > 100) {
            return res.status(400).json({
                message: 'Limit must be between 1 and 100'
            });
        }
        const collection = await getCollection('sample_movies_v1');
        const movies = await collection
            .find({}, { projection: { plot_embedding: 0 } })
            .skip(skip)
            .limit(limit)
            .toArray();

        res.json({
            data: movies
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
})

function getAggregationPipeline(embeddings, id) {
    const aggPipeline = [
        {
            $vectorSearch: {
                index: "movies_vector_index_v1",
                path: "plot_embedding",
                queryVector: embeddings,
                numCandidates: 100, // Search 100 nearest docs
                limit: 10,  // Return top 10 results
            },
        },
        {
            $project: {
                plot_embedding: 0,
                "score": { "$meta": "vectorSearchScore" }
            }
        }
    ]
    if (id) {
        aggPipeline.push({
            $match: { _id: { $ne: new ObjectId(id) } }
        });
    }
    console.log(aggPipeline)
    return aggPipeline;
}

app.get('/movies/recommend/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const collection = await getCollection('sample_movies_v1')
        const { plot_embedding } = await collection.findOne(
            { _id: new ObjectId(movieId) },
            { projection: { plot_embedding: 1 } }
        );
        console.log('movie->', plot_embedding.length);
        const aggregationPipeline = await getAggregationPipeline(plot_embedding, movieId);
        const movies = await collection
            .aggregate(aggregationPipeline)
            .toArray();

        res.json({
            data: movies
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
})




// Start server
const server = app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    await connectToMongo();
});

// Graceful shutdown handler
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Gracefully shutting down...');

    try {
        // Close MongoDB connection
        await closeConn();
        console.log('✅ MongoDB connection closed');

        // Close Express server
        server.close(() => {
            console.log('✅ Express server closed');
            console.log('👋 Process terminated gracefully');
            process.exit(0);
        });
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
});

