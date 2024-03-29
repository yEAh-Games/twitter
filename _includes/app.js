fetch('tweets.jsonl')
    .then(response => response.text())
    .then(data => {
        const tweets = data.trim().split('\n');
        const tweetContainer = document.querySelector('#tweetContainer');
        const loadingIcon = document.querySelector('#loadingIcon');

        const tweetsPerBatch = 10; 
        let visibleTweets = 0; 

        function displayTweets(tweetArray) {
            const fragment = document.createDocumentFragment(); \

            tweetArray.forEach(tweet => {
                const { date, user, content, url, media } = JSON.parse(tweet);

                const tweetElement = document.createElement('div');
                tweetElement.classList.add('tweet');

                const dateElement = document.createElement('div');
                dateElement.id = 'tweetdate';
                dateElement.classList.add('tweet-date', 'text-blue-500', 'font-bold', 'mb-2');
                dateElement.textContent = date;
                tweetElement.appendChild(dateElement);

                const usernameElement = document.createElement('div');
                usernameElement.id = 'tweetuser';
                usernameElement.classList.add('tweet-username', 'text-gray-700', 'font-bold');
                usernameElement.innerHTML = '<img src="' + user.profileImageUrl + '" alt="Profile Picture" class="h-8 w-8 rounded-full mr-2 inline-block">' + user.username;
                tweetElement.appendChild(usernameElement);

                const contentElement = document.createElement('div');
                contentElement.id = 'tweetcontent';
                contentElement.classList.add('tweet-content', 'text-gray-900');
                contentElement.textContent = content;
                tweetElement.appendChild(contentElement);

                const twitterIconElement = document.createElement('i');
                twitterIconElement.classList.add('fab', 'fa-twitter', 'tweet-url-icon');
                twitterIconElement.setAttribute('title', 'View original on Twitter');
                tweetElement.appendChild(twitterIconElement);

                twitterIconElement.addEventListener('click', () => {
                    window.open(url, '_blank');
                });

                if (media && media.length > 0 && media[0]._type === 'snscrape.modules.twitter.Photo') {
                    const mediaContainer = document.createElement('div');
                    mediaContainer.classList.add('tweet-media-container');

                    const imageElement = document.createElement('img');
                    imageElement.classList.add('tweet-media');
                    imageElement.src = media[0].fullUrl;
                    mediaContainer.appendChild(imageElement);

                    tweetElement.appendChild(mediaContainer);

                    imageElement.addEventListener('click', function () {
                        const overlayElement = document.createElement('div');
                        overlayElement.classList.add('tweet-overlay');

                        const closeButton = document.createElement('button');
                        closeButton.classList.add('tweet-overlay-close');
                        closeButton.innerHTML = 'X';

                        const fullImageElement = document.createElement('img');
                        fullImageElement.src = media[0].fullUrl;
                        fullImageElement.classList.add('tweet-overlay-image');

                        overlayElement.appendChild(closeButton);
                        overlayElement.appendChild(fullImageElement);

                        tweetContainer.appendChild(overlayElement);

                        closeButton.addEventListener('click', function () {
                            overlayElement.remove();
                        });
                    });
                }

                fragment.appendChild(tweetElement);
            });

            tweetContainer.appendChild(fragment);
            visibleTweets += tweetArray.length;
            loadingIcon.style.display = 'none';
        }


        function loadMoreTweets() {
            const remainingTweets = tweets.length - visibleTweets;
            const tweetsToShow = Math.min(tweetsPerBatch, remainingTweets);
            if (tweetsToShow > 0) {
                const tweetsBatch = tweets.slice(visibleTweets, visibleTweets + tweetsToShow);
                displayTweets(tweetsBatch);
            }
        }

        function searchTweets(event) {
            event.preventDefault(); // Prevent form submission

            const searchTerm = document.querySelector('#searchInput').value.toLowerCase();
            const matchingTweets = tweets.filter(tweet => {
                const { user, content } = JSON.parse(tweet);
                return user.username.toLowerCase().includes(searchTerm) || content
                    .toLowerCase().includes(searchTerm);
            });
            tweetContainer.innerHTML = ''; // Clear the existing tweets
            visibleTweets = 0; // Reset the visible tweets counter
            displayTweets(matchingTweets); // Display the matching tweets
        }

        // Update the event listener to the form submit event
        document.querySelector('#searchForm').addEventListener('submit', searchTweets);

        function showLoadingIcon() {
            loadingIcon.style.display = 'block';
        }

        // Display initial batch of tweets
        loadMoreTweets();

        // Add event listener to the search button
        document.querySelector('#searchButton').addEventListener('click', searchTweets);

        // Add event listener to scroll event for lazy loading
        window.addEventListener('scroll', () => {
            const scrollPosition = window.innerHeight + window.pageYOffset;
            const pageHeight = document.documentElement.scrollHeight;

            // Check if the user has reached the bottom of the page
            if (scrollPosition >= pageHeight) {
                showLoadingIcon();
                loadMoreTweets();
            }
        });
    })
    .catch(error => console.error(error));


    {% assign username = page.name | remove: ".md" %}
    {% assign account = site.data.accounts | where: "username", username | first %}
    
    
    var progressBar = document.querySelector('#progress-bar');
    var request = new XMLHttpRequest();
    var url = 'https://archive{{account.host}}.ynwk.org/c/artifacts/twitter/{{account.username}}/tweets.jsonl';
    request.open('GET', url, true);
    
    request.addEventListener('progress', function (event) {
      if (event.lengthComputable) {
        var percentComplete = (event.loaded / event.total) * 100;
        progressBar.style.width = percentComplete + '%';
      }
    });
    
    request.addEventListener('load', function (event) {
      progressBar.style.width = '100%';
    });
    
    request.send();