
  $(document).ready(function() {
    
  });
  
$("#chat-form").on("submit", async function(e) {
  e.preventDefault();
  function appendMessage1(sender, text){
    $("#chat-window").append(sender+":"+text+"<BR/>");
    };
  function appendMessage(sender, text){
    appendMessage1(sender,text)
    window.appendMessage = appendMessage;
    };
  const message = $("#user-input").val();
  appendMessage("user", message);
  $("#user-input").val("");

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    // get the raw response text for debugging
    const text = await res.text();
    console.log("❯ /chat response status:", res.status);
    console.log("❯ /chat raw response:", text);

    if (!res.ok) {
      // show the status code and text in the UI
      appendMessage("assistant", `⚠️ Error ${res.status}: ${text}`);
      return;
    }
    
    
    // parse JSON only if OK
    let body;
    try {
      body = JSON.parse(text);
    } catch (parseErr) {
      console.error("Failed to parse JSON:", parseErr);
      appendMessage("assistant", `⚠️ Invalid JSON response`);
      return;
    }

    appendMessage("assistant", body.reply || "⚠️ No reply field");
  } catch (err) {
    console.error("Fetch threw error:", err);
    appendMessage("assistant", "⚠️ Oops, something went wrong.");
  }
});

