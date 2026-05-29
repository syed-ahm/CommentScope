// based on YT comment API response body

interface YTComment {
	id: string;
	comment: string;
}

interface YTCommentItem {
	snippet: {
		topLevelComment: {
			id: string;
			snippet: {
				textOriginal: string;
			};
		};
	};
}

interface YTDataResponse {
	items: YTCommentItem[];
}

export { YTComment, YTCommentItem, YTDataResponse };
