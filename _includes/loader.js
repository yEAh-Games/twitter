{% assign username = page.name | remove: ".md" %}
{% assign account = site.data.accounts | where: "username", username | first %}


var progressBar = document.querySelector('#progress-bar');
var request = new XMLHttpRequest();
var url = 'https://archive{{account.host}}.yeahgames.net/c/artifacts/twitter/{{account.username}}/tweets.jsonl';
request.open('GET', url, true);

request.addEventListener('progress', function (event) {
  if (event.lengthComputable) {
    var percentComplete = (event.loaded / event.total) * 100;
    progressBar.style.width = percentComplete + '%';
  }
});

request.addEventListener('load', function (event) {
  // File has been successfully loaded
  progressBar.style.width = '100%';
});

request.send();