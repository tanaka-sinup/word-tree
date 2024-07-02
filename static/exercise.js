document.getElementById('show-answer-button').addEventListener('click', function() {
  const answer = document.getElementById('answer-text');
  if (answer.style.display === 'none') {
    answer.style.display = 'block';
    this.textContent = '解答を隠す';
  } else {
    answer.style.display = 'none';
    this.textContent = '解答を表示';
  }
});
