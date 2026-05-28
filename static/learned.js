document.querySelectorAll(".restore-button").forEach((button) => {
  button.addEventListener("click", async () => {
    const cardId = button.getAttribute("data-id");
    const response = await fetch("/restore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: cardId }),
    });
    if (response.ok) {
      button.textContent = "復活しました";
      button.disabled = true;
    } else {
      console.error("Failed to restore");
    }
  });
});
