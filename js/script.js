const postForm = document.querySelector("#post-form");
const postContentInput = document.querySelector("#post-content");
const postFeed = document.querySelector("#post-feed");

if (postForm && postContentInput && postFeed) {
	postContentInput.addEventListener("input", () => {
		postContentInput.setCustomValidity("");
	});

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
		postFeed.prepend(post);
		postForm.reset();
	});

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

		const currentCount = Number(likeCount.dataset.count ?? likeCount.textContent.match(/\d+/)?.[0] ?? 0);
		const nextCount = currentCount + 1;
		likeCount.dataset.count = String(nextCount);
		likeCount.textContent = `${nextCount} ${nextCount === 1 ? "Like" : "Likes"}`;
	});
}

