$(function() {
    const $chatWindow = $("#chat-window");
    const $input = $("#user-input");
  
    function appendMessage(sender, text) {
      const cls = sender === "user" ? "msg-user" : "msg-assistant";
      $chatWindow.append(`<div class="${cls}"><strong>${sender}:</strong> ${text}</div>`);
      $chatWindow.scrollTop($chatWindow.prop("scrollHeight"));
    }
  
    $("#chat-form").on("submit", async function(e) {
      e.preventDefault();
      const message = $input.val();
      appendMessage("user", message);
      $input.val("");
  
      try {
        const res = await fetch("/chat", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({message})
        });
        const body = await res.json();
        appendMessage("assistant", body.reply);
      } catch (err) {
        appendMessage("assistant", "⚠️ Oops, something went wrong.");
        console.error(err);
      }
    });
  });
  