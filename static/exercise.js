document
  .getElementById("show-answer-button")
  .addEventListener("click", function () {
    const answer = document.getElementById("answer-text");
    if (answer.style.display === "none") {
      answer.style.display = "block";
      this.textContent = "解答を隠す";
    } else {
      answer.style.display = "none";
      this.textContent = "解答を表示";
    }
  });
  document.addEventListener("DOMContentLoaded", function() {
    const answer = document.getElementById("answer-text");
    answer.style.display = "none";
  });

  document.getElementById('mark-learned-button').addEventListener('click', function() {
    // ここに覚えたボタンがクリックされた時の処理を記述する
    const learnedList = document.querySelector('html.learned');
    const newItem = document.createElement('li');
    newItem.textContent = '覚えた単語の内容'; // 実際の内容に置き換える
    learnedList.appendChild(newItem);
});
