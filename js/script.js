// Cache the form controls and feed container.
const postForm = document.querySelector("#post-form");
const postContentInput = document.querySelector("#post-content");
const postFeed = document.querySelector("#post-feed");

// Add a comment form and list to an individual post.
function initializeComments(post) {
	const commentsSection = post.querySelector(".comments-section");
	if (!commentsSection) {
		return;
	}

	const commentForm = document.createElement("form");
	commentForm.className = "comment-form mb-3";
	const inputGroup = document.createElement("div");
	inputGroup.className = "input-group";
	const commentInput = document.createElement("input");
	commentInput.type = "text";
	commentInput.className = "form-control comment-input";
	commentInput.placeholder = "Write a comment...";
	commentInput.setAttribute("aria-label", "Write a comment");
	commentInput.required = true;
	commentInput.addEventListener("input", () => {
		commentInput.setCustomValidity("");
	});

	const commentButton = document.createElement("button");
	commentButton.type = "submit";
	commentButton.className = "btn btn-primary";
	commentButton.textContent = "Comment";
	inputGroup.append(commentInput, commentButton);
	commentForm.append(inputGroup);

	const commentsList = document.createElement("div");
	commentsList.className = "comments-list";
	commentsList.setAttribute("aria-live", "polite");
	commentsSection.replaceChildren(commentForm, commentsList);
}

// Set up post controls and feed interactions when the required elements exist.
if (postForm && postContentInput && postFeed) {
	// Prepare sample posts for comments and like toggling.
	postFeed.querySelectorAll(".post").forEach(initializeComments);

	postFeed.querySelectorAll(".like-button").forEach((likeButton) => {
		likeButton.setAttribute("aria-pressed", "false");
	});

	// Clear custom validation errors as the post text changes.
	postContentInput.addEventListener("input", () => {
		postContentInput.setCustomValidity("");
	});

	// Validate and prepend each submitted post.
	postForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const content = postContentInput.value.trim();
		if (!content) {
			postContentInput.setCustomValidity("Please enter text before publishing.");
			postContentInput.reportValidity();
			return;
		}

		postContentInput.setCustomValidity("");

		const post = document.createElement("article");
		post.className = "card shadow-sm mb-3 post";

		const cardBody = document.createElement("div");
		cardBody.className = "card-body";

		const authorRow = document.createElement("div");
		authorRow.className = "d-flex justify-content-between align-items-center mb-3";
		const authorDetails = document.createElement("div");
		const author = document.createElement("h6");
		author.className = "mb-0";
		author.textContent = "User";
		const postedTime = document.createElement("small");
		postedTime.className = "text-muted";
		postedTime.textContent = "Posted just now";
		authorDetails.append(author, postedTime);
		authorRow.append(authorDetails);

		const postText = document.createElement("p");
		postText.className = "post-content";
		postText.textContent = content;

		const postActions = document.createElement("div");
		postActions.className = "post-actions d-flex align-items-center gap-3";
		const likeButton = document.createElement("button");
		likeButton.type = "button";
		likeButton.className = "btn btn-outline-primary btn-sm like-button";
		likeButton.setAttribute("aria-pressed", "false");
		likeButton.textContent = "Like";
		const likeCount = document.createElement("span");
		likeCount.className = "like-count text-muted small";
		likeCount.dataset.count = "0";
		likeCount.textContent = "0 Likes";
		postActions.append(likeButton, likeCount);

		const commentsSection = document.createElement("div");
		commentsSection.className = "comments-section mt-3";

		cardBody.append(authorRow, postText, document.createElement("hr"), postActions, commentsSection);
		post.append(cardBody);
		initializeComments(post);
		postFeed.prepend(post);
		postForm.reset();
	});

	// Validate comments and append them to their matching post.
	postFeed.addEventListener("submit", (event) => {
		if (!(event.target instanceof HTMLFormElement) || !event.target.matches(".comment-form")) {
			return;
		}

		event.preventDefault();
		const commentForm = event.target;
		const commentInput = commentForm.querySelector(".comment-input");
		const commentsList = commentForm.closest(".comments-section")?.querySelector(".comments-list");
		if (!commentInput || !commentsList) {
			return;
		}

		const content = commentInput.value.trim();
		if (!content) {
			commentInput.setCustomValidity("Please enter a comment.");
			commentInput.reportValidity();
			return;
		}

		commentInput.setCustomValidity("");

		const comment = document.createElement("div");
		comment.className = "comment border-top pt-2";
		const author = document.createElement("strong");
		author.className = "d-block small";
		author.textContent = "User";
		const commentText = document.createElement("p");
		commentText.className = "mb-0";
		commentText.textContent = content;
		comment.append(author, commentText);
		commentsList.append(comment);
		commentForm.reset();
	});

	// Toggle the selected post's like state and count.
	postFeed.addEventListener("click", (event) => {
		if (!(event.target instanceof Element)) {
			return;
		}

		const likeButton = event.target.closest(".like-button");
		if (!likeButton) {
			return;
		}

		const likeCount = likeButton.closest(".post")?.querySelector(".like-count");
		if (!likeCount) {
			return;
		}

		const wasLiked = likeButton.getAttribute("aria-pressed") === "true";
		const currentCount = Number(likeCount.dataset.count ?? likeCount.textContent.match(/\d+/)?.[0] ?? 0);
		const nextCount = Math.max(0, currentCount + (wasLiked ? -1 : 1));
		likeButton.setAttribute("aria-pressed", String(!wasLiked));
		likeCount.dataset.count = String(nextCount);
		likeCount.textContent = `${nextCount} ${nextCount === 1 ? "Like" : "Likes"}`;
	});
}

