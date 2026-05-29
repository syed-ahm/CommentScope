import express from "express";
import { YTComment, YTDataResponse } from "./types";

const app = express();
const PORT = process.env.PORT || 3000;

// TODO use google API lib?

// CORS middleware - allow requests from chrome extensions
app.use((_, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});

app.get("/", (_, res) => {
	res.send("Server is running");
});

app.get("/api/v1/comment-analysis", async (req, res) => {
	try {
		const params = req.query;
		const videoID = params.videoID;
		if (typeof videoID !== "string" || videoID.length == 0) {
			res
				.status(400)
				.json({ message: "Error: Bad Request, missing or incorrect videoID." });
			return;
		}

		const apiKey = "";
		const url: string = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoID}&maxResults=100&order=relevance&key=${apiKey}`;

		// call YT API
		const response = await fetch(url);
		if (!response.ok) {
			res
				.status(response.status)
				.json({ message: "Error: YT Data API request failed" });
		}
		const videoCommentResponse: YTDataResponse =
			(await response.json()) as YTDataResponse;

		// structure comment data
		const comments: YTComment[] = [];
		for (const item of videoCommentResponse.items) {
			const id = item.snippet.topLevelComment.id;
			const comment = item.snippet.topLevelComment.snippet.textOriginal;
			comments.push({ id, comment });
		}

		// able to retrieve comments
		// for (const c of comments) {
		// 	console.log(`Comment ${c.id}: ${c.comment}`);
		// }
		// TODO: check cache

		// test

		// call embeddings model

		// clustering algo

		// call LLM API

		// TODO: store in redis

		res.json({ success: true, videoID: videoID });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Error: 500 Internal server error" });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port localhost:${PORT}`);
});
