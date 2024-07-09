document.getElementById('show-answer-button').addEventListener('click', function() {
  const answer = document.getElementById('answer');
  if (answer.style.display === 'none') {
    answer.style.display = 'block';
    this.textContent = '解答を隠す';
  } else {
    answer.style.display = 'none';
    this.textContent = '解答を表示';
  }
});

document.getElementById('mark-learned-button').addEventListener('click', async function() {
  const question = document.getElementById('question').textContent;
  const response = await fetch('/learned', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, learned: true }),
  });
  if (response.ok) {
    this.textContent = '✓ 覚えた';
    this.disabled = true;
  } else {
    console.error('Failed to mark as learned');
  }
});
