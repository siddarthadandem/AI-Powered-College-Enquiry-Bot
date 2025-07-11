document.addEventListener("DOMContentLoaded", () => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar) {
          // Create spacer div for 2 line spaces (approx 40px height)
          const spacer = document.createElement("div");
          spacer.style.height = "40px";
          sidebar.appendChild(spacer);

          // Create 4 dynamic buttons below the spacer in the sidebar with spacing
          const buttonLabels = ["Button 1", "Button 2", "Button 3", "Button 4", "History"];
          buttonLabels.forEach((label, index) => {
              const btn = document.createElement("button");
              btn.id = `dynamic-button-${index + 1}`;
              btn.style.display = "block";
              btn.style.width = "90%";
              btn.style.margin = "16px auto";
              btn.style.padding = "10px";
              btn.style.borderRadius = "8px";
              btn.style.border = "1px solid #ccc";
              btn.style.backgroundColor = "#f0f0f0";
              btn.style.cursor = "pointer";
              btn.style.fontSize = "1rem";
              btn.style.textAlign = "center";

              if (index === 0) {
                  // Replace Button 1 with logo1.jpeg image
                  const img = document.createElement("img");
                  img.src = "/static/logo1.jpeg";
                  img.alt = "Logo 1";
                  img.style.maxWidth = "75%";
                  img.style.maxHeight = "75%";
                  img.style.objectFit = "contain";
                  img.style.pointerEvents = "none"; // prevent image from capturing clicks
                  // Remove border and background of button
                  btn.style.border = "none";
                  btn.style.backgroundColor = "transparent";
                  btn.appendChild(img);
              } else if (index === 1) {
                  // Replace Button 2 with text "KITS(S) FACULTY" (remove anchor for better click handling)
                  btn.textContent = "KITS(S) FACULTY";
                  btn.style.color = "#212F3D";
                  btn.style.fontWeight = "bold";
                  btn.style.border = "none";
                  btn.style.backgroundColor = "transparent";
                  btn.style.padding = "10px 0";
              } else if (index === 2) {
                  // Replace Button 3 with span element with enlarged, thick violet colored text and no border/background on button
                  const span = document.createElement("span");
                  span.className = "d-none d-lg-block";
                  span.textContent = "KITS24BY7";
                  span.style.color = "navy";
                  span.style.fontWeight = "900"; // thick text
                  span.style.fontSize = "1.5rem"; // enlarged text
                  btn.style.border = "none";
                  btn.style.backgroundColor = "transparent";
                  btn.appendChild(span);
              } else if (index === 3) {
                  // Replace Button 4 with text "KITS(S) Student Login" with pitch black color and no border/background
                  btn.textContent = "KITS(S) Student Login";
                  btn.style.color = "black";
                  btn.style.border = "none";
                  btn.style.backgroundColor = "transparent";
              } else if (index === 4) {
                  // History button with toggle functionality
                  btn.textContent = "History";
                  btn.style.color = "black";
                  btn.style.border = "none";
                  btn.style.backgroundColor = "transparent";
                  btn.id = "history-toggle";
              } else {
                  btn.textContent = label;
              }

              // Append buttons at the end of the sidebar to move them below spacer
          sidebar.appendChild(btn);
      });

      // Add click event listener to the first dynamic button (image button) to open https://www.kitss.edu.in/
      const button1 = document.getElementById("dynamic-button-1");
      if (button1) {
          button1.addEventListener("click", () => {
              window.open("https://www.kitss.edu.in/", "_blank");
          });
      }

      // Hide chat history container initially
      const chatHistoryContainer = document.getElementById("chat-history");
      const historyToggleBtn = document.getElementById("history-toggle");
      if (chatHistoryContainer && historyToggleBtn) {
          chatHistoryContainer.style.display = "none";
          // Move chat history container to be immediately after History button
          historyToggleBtn.insertAdjacentElement('afterend', chatHistoryContainer);

          // Add event listener for History button toggle
          historyToggleBtn.addEventListener("click", () => {
              if (chatHistoryContainer.style.display === "none") {
                  chatHistoryContainer.style.display = "block";
                  updateHistory();
              } else {
                  chatHistoryContainer.style.display = "none";
              }
          });
      }
      }
  const chatBox = document.getElementById("chat-box");
  const inputForm = document.getElementById("input-form");
  const userInput = document.getElementById("user-input");
  const micBtn = document.getElementById("mic-btn");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  // Removed duplicate declaration of sidebar here
  const sidebarClose = document.getElementById("sidebar-close");
  const clearChatBtn = document.getElementById("clear-chat");
  const thinkModeBtn = document.getElementById("think-mode");
  const deepSearchBtn = document.getElementById("deep-search");
  const chatHistory = document.getElementById("chat-history");
  const chatContainer = document.getElementById("chat-container");
  const welcomeMessage = document.getElementById("welcome-message");
  const animatedWelcome = document.getElementById("animated-welcome");

  // Add event listener to the button with id "icon2" to refresh the page on click
  const icon2Button = document.getElementById('icon2');
  console.log('icon2Button:', icon2Button);
  if (icon2Button) {
    icon2Button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      console.log('icon2Button clicked');
      window.location.reload();
    });
  }

  // Store conversations
  let conversations = JSON.parse(localStorage.getItem("conversations")) || [];
  let currentConversationId = null;
  let isChatExpanded = false;

  const sendButtonArrow = document.querySelector(".send-button-arrow");
  if (sendButtonArrow) {
    sendButtonArrow.addEventListener("click", (event) => {
      event.preventDefault();
      const message = userInput.value.trim();
      if (message) {
        sendMessage(message);
        userInput.value = "";
        userInput.focus();
      }
    });
  }

  // Background graphics animation
  const backgroundGraphics = document.querySelector(".background-graphics");
  const rocketCount = 20;
  const rockets = [];

  function randomRange(min, max) {
      return Math.random() * (max - min) + min;
  }

  function createRocket() {
      if (!backgroundGraphics) return null;
      const rocket = document.createElement("div");
      rocket.classList.add("rocket");
      const sizeClass = ["small", "medium", "large"][Math.floor(Math.random() * 3)];
      rocket.classList.add(sizeClass);
      rocket.innerHTML = `
          <svg viewBox="0 0 64 128" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
              <path d="M32 4 L12 60 L32 52 L52 60 Z" fill="#d0e6ff" stroke="#a0c4ff"/>
              <path d="M12 60 L32 124 L52 60" fill="#a0c4ff" stroke="#7a9eff"/>
              <circle cx="32" cy="52" r="6" fill="#ffffff" stroke="#a0c4ff"/>
          </svg>
      `;
      rocket.style.top = `${randomRange(0, 100)}vh`;
      rocket.style.left = `${randomRange(0, 100)}vw`;
      backgroundGraphics.appendChild(rocket);
      return {
          el: rocket,
          sizeClass,
          x: parseFloat(rocket.style.left),
          y: parseFloat(rocket.style.top),
          directionX: randomRange(-0.05, 0.05),
          directionY: randomRange(-0.05, 0.05),
      };
  }

  function updateRockets() {
      rockets.forEach((rocket) => {
          rocket.x += rocket.directionX;
          rocket.y += rocket.directionY;
          if (rocket.x < 0 || rocket.x > 100) rocket.directionX *= -1;
          if (rocket.y < 0 || rocket.y > 100) rocket.directionY *= -1;
          rocket.el.style.left = `${rocket.x}vw`;
          rocket.el.style.top = `${rocket.y}vh`;
      });
      requestAnimationFrame(updateRockets);
  }

  for (let i = 0; i < rocketCount; i++) {
      const rocket = createRocket();
      if (rocket) rockets.push(rocket);
  }
  updateRockets();

  function createMessageElement(sender, text) {
      const messageEl = document.createElement("div");
      messageEl.classList.add("message", sender);
      const avatarEl = document.createElement("div");
      avatarEl.classList.add("avatar", sender);
      messageEl.appendChild(avatarEl);
      const textEl = document.createElement("div");
      textEl.classList.add("text");
      textEl.textContent = text;
      messageEl.appendChild(textEl);
      return messageEl;
  }

  function addMessage(sender, text) {
      const messageEl = createMessageElement(sender, text);
      if (sender === "bot") {
        // Add logo image inside bot message bubble
        const avatarEl = messageEl.querySelector(".avatar.bot");
        if (avatarEl) {
          avatarEl.innerHTML = '<img src="/static/logo.jpeg" alt="Bot Logo" style="width: 24px; height: 24px; border-radius: 50%;">';
        }
        // Set background color to white and text color to black
        messageEl.style.backgroundColor = "white";
        messageEl.style.color = "black";

        // Animate text letter-by-letter
        const textEl = messageEl.querySelector(".text");
        if (textEl) {
          textEl.textContent = "";
          let index = 0;
          function type() {
            if (index < text.length) {
              textEl.textContent += text.charAt(index);
              index++;
              setTimeout(type, 50);
            }
          }
          type();
        }
      } else if (sender === "user") {
        // Add user logo image inside user message bubble
        const avatarEl = messageEl.querySelector(".avatar.user");
        if (avatarEl) {
          avatarEl.innerHTML = '<img src="/static/userlogo.jpeg" alt="User Logo" style="width: 24px; height: 24px; border-radius: 50%;">';
        }
      }
      chatBox.appendChild(messageEl);
      chatBox.scrollTop = chatBox.scrollHeight;

      // Scroll chat container to bottom to show latest message
      // Removed scrolling chat container to avoid double scroll
      // const chatContainer = document.getElementById("chat-container");
      // if (chatContainer) {
      //   chatContainer.scrollTop = chatContainer.scrollHeight;
      // }

      if (currentConversationId) {
          const convo = conversations.find(c => c.id === currentConversationId);
          convo.messages.push({ sender, text });
          localStorage.setItem("conversations", JSON.stringify(conversations));
      }
  }

  // Removed showTypingIndicator function as logo will appear inside bot response message
  // function showTypingIndicator() {
  //     const typingEl = document.createElement("div");
  //     typingEl.classList.add("message", "bot", "typing-indicator");
  //     typingEl.innerHTML = '<img src="/static/logo.jpeg" alt="Loading" style="width: 24px; height: 24px; border-radius: 50%;">';
  //     chatBox.appendChild(typingEl);
  //     chatBox.scrollTop = chatBox.scrollHeight;
  //     return typingEl;
  // }

  function newConversation() {
      const id = Date.now().toString();
      const convo = { id, messages: [], timestamp: new Date().toLocaleString() };
      conversations.push(convo);
      currentConversationId = id;
      localStorage.setItem("conversations", JSON.stringify(conversations));
      updateHistory();
      chatBox.innerHTML = "";
  }

  function updateHistory() {
      chatHistory.innerHTML = "";
      conversations.forEach(convo => {
          const li = document.createElement("li");
          li.dataset.id = convo.id;

          // Create timestamp span
          const timestampSpan = document.createElement("span");
          timestampSpan.className = "timestamp";
          timestampSpan.textContent = convo.timestamp;

          // Create preview span with last message snippet
          const previewSpan = document.createElement("span");
          previewSpan.className = "preview";
          if (convo.messages.length > 0) {
              const lastMsg = convo.messages[convo.messages.length - 1];
              previewSpan.textContent = lastMsg.text.length > 30 ? lastMsg.text.substring(0, 30) + "..." : lastMsg.text;
          } else {
              previewSpan.textContent = "(No messages)";
          }

          li.appendChild(timestampSpan);
          li.appendChild(previewSpan);

          li.addEventListener("click", () => {
              currentConversationId = convo.id;
              chatBox.innerHTML = "";
              convo.messages.forEach(msg => {
                  addMessage(msg.sender, msg.text);
              });
              sidebar.classList.remove("open");
              if (!isChatExpanded) {
                  expandChat();
              }
          });
          chatHistory.appendChild(li);
      });
  }

  function expandChat() {
      chatContainer.classList.add("expanded");
      welcomeMessage.classList.add("hidden");
      isChatExpanded = true;
  }

  // Letter-by-letter animation for welcome message
  function animateWelcomeMessage(text, element) {
      let index = 0;
      element.textContent = "";
      function type() {
          if (index < text.length) {
              element.textContent += text.charAt(index);
              index++;
              setTimeout(type, 100);
          }
      }
      type();
  }

  // Animate welcome message on page load if chat not expanded
  if (!isChatExpanded && animatedWelcome) {
      animateWelcomeMessage("Hey There! How can I help you..", animatedWelcome);
  }

  async function sendMessage(message) {
      console.log('sendMessage called with:', message);
      if (!message) return;
      if (!currentConversationId) newConversation();

      // Hide header and welcome message when a message is sent
      const header = document.querySelector(".kitsbot-header");
      const welcomeMsg = document.getElementById("welcome-message");
      const animatedWelcome = document.getElementById("animated-welcome");
      if (header) header.textContent = "";
      if (welcomeMsg) welcomeMsg.style.display = "none";
      if (animatedWelcome) animatedWelcome.style.display = "none";

      // Move chat container down from top
      const chatContainer = document.getElementById("chat-container");
      if (chatContainer) {
        chatContainer.style.marginTop = "60px";
      }

      if (!isChatExpanded) {
          expandChat();
      }

      addMessage("user", message);
      userInput.value = "";
      console.log('userInput cleared');
      userInput.disabled = true;
      micBtn.disabled = true;

      // Move input form down after first message is sent
      const inputForm = document.getElementById("input-form");
      if (!inputForm.classList.contains("bottom-position")) {
          inputForm.classList.add("bottom-position");
          // Change input form position to absolute inside chat container
          inputForm.style.position = "absolute";
      }

      // Add KitsBOT button beside sidebar when message is sent
      let kitsBotButtonContainer = document.getElementById("kitsbot-button-container");
      if (!kitsBotButtonContainer) {
          kitsBotButtonContainer = document.createElement("div");
          kitsBotButtonContainer.id = "kitsbot-button-container";
          const sidebar = document.getElementById("sidebar");
          if (sidebar && sidebar.parentNode) {
              sidebar.parentNode.insertBefore(kitsBotButtonContainer, sidebar.nextSibling);
          }
      }
      kitsBotButtonContainer.innerHTML = `
        <button aria-label="" type="button" id="radix-«rau»" aria-haspopup="menu" aria-expanded="false" data-state="closed" data-testid="model-switcher-dropdown-button" class="group flex cursor-pointer items-center gap-1 rounded-lg py-1.5 px-3 text-lg hover:bg-token-main-surface-secondary font-normal whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2" style="view-transition-name: var(--vt-thread-model-switcher);"><div>KitsBOT</div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md text-token-text-tertiary"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z" fill="currentColor"></path></svg></button>
      `;
      kitsBotButtonContainer.style.display = "flex";

      // Add typing indicator element with moving dots animation
      const typingIndicator = document.createElement("div");
      typingIndicator.className = "typing-indicator";
      typingIndicator.style.display = "flex";
      typingIndicator.style.alignItems = "center";
      typingIndicator.style.gap = "6px";
      typingIndicator.style.marginLeft = "46px";
      typingIndicator.style.fontSize = "1.5rem";
      typingIndicator.style.color = "black";

      // Add logo image in circle to the left of dots
      const logoImg = document.createElement("img");
      logoImg.src = "/static/logo.jpeg";
      logoImg.alt = "Bot Logo";
      logoImg.style.width = "24px";
      logoImg.style.height = "24px";
      logoImg.style.borderRadius = "50%";
      logoImg.style.objectFit = "cover";

      typingIndicator.appendChild(logoImg);

      for (let i = 0; i < 3; i++) {
          const dot = document.createElement("span");
          dot.style.width = "8px";
          dot.style.height = "8px";
          dot.style.background = "black";
          dot.style.borderRadius = "50%";
          dot.style.animation = `blink 1.4s infinite both`;
          dot.style.animationDelay = `${i * 0.2}s`;
          typingIndicator.appendChild(dot);
      }

      chatBox.appendChild(typingIndicator);
      chatBox.scrollTop = chatBox.scrollHeight;

      try {
          const response = await fetch("/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message }),
          });

          const data = await response.json();
          typingIndicator.remove();
          addMessage("bot", data.reply);

          if ('speechSynthesis' in window) {
              if (window.speechSynthesis.speaking) {
                  window.speechSynthesis.cancel();
              }
              const utterance = new SpeechSynthesisUtterance(data.reply);
              utterance.lang = 'en-US';
              utterance.volume = 1;
              utterance.rate = 1;
              utterance.pitch = 1;
              utterance.onerror = (event) => {
                  console.error('SpeechSynthesisUtterance error:', event.error);
              };
              window.speechSynthesis.speak(utterance);
          }
      } catch (error) {
          typingIndicator.remove();
          console.error("Error in sendMessage:", error);
          const errorMessage = error.message || "Oops! Something went wrong. 😞";
          addMessage("bot", errorMessage);
      } finally {
          userInput.disabled = false;
          micBtn.disabled = false;
          userInput.focus();
      }
  }


  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const message = userInput.value.trim();
      console.log('Enter pressed, message:', message);
      if (message) sendMessage(message);
    }
  });

  micBtn.addEventListener("click", () => {
      if (!("webkitSpeechRecognition" in window)) {
          alert("Speech recognition not supported in this browser.");
          return;
      }

      const recognition = new webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.start();

      recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          userInput.value = transcript;
          sendMessage(transcript);
      };

      recognition.onerror = (event) => {
          console.error("Voice error:", event.error);
          alert("Voice recognition error. Try again.");
      };
  });

  sidebarToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const kitsbotButtonContainer = document.getElementById("kitsbot-button-container");
      if (sidebar.classList.contains("open")) {
          sidebar.classList.remove("open");
          sidebarToggle.style.display = "block";
          document.body.classList.remove("sidebar-open");
          if (kitsbotButtonContainer) {
            kitsbotButtonContainer.style.left = "auto";
            kitsbotButtonContainer.style.right = "20px";
            kitsbotButtonContainer.style.transform = "none";
          }
      } else {
          sidebar.classList.add("open");
          sidebarToggle.style.display = "none";
          document.body.classList.add("sidebar-open");
          if (kitsbotButtonContainer) {
            kitsbotButtonContainer.style.left = "310px"; // 300px sidebar width + 10px margin
            kitsbotButtonContainer.style.right = "auto";
            kitsbotButtonContainer.style.transform = "none";
          }
      }
  });

  sidebarClose.addEventListener("click", (event) => {
      event.stopPropagation();
      sidebar.classList.remove("open");
      sidebarToggle.style.display = "block";
      document.body.classList.remove("sidebar-open");
      const kitsbotButtonContainer = document.getElementById("kitsbot-button-container");
      if (kitsbotButtonContainer) {
        kitsbotButtonContainer.style.left = "auto";
        kitsbotButtonContainer.style.right = "20px";
        kitsbotButtonContainer.style.transform = "none";
      }
  });

  clearChatBtn.addEventListener("click", () => {
      chatBox.innerHTML = "";
      if (currentConversationId) {
          const convo = conversations.find(c => c.id === currentConversationId);
          convo.messages = [];
          localStorage.setItem("conversations", JSON.stringify(conversations));
      }
  });

  thinkModeBtn.addEventListener("click", () => {
      alert("Think mode is not implemented yet.");
  });

  deepSearchBtn.addEventListener("click", () => {
      alert("DeepSearch mode is not implemented yet.");
  });

  // Initialize
  newConversation();

  // Add event listeners for new sidebar buttons
  const button1 = document.getElementById("dynamic-button-2"); // KITS(S) FACULTY
  const button2 = document.getElementById("dynamic-button-4"); // KITS(S) Student Login
  const button3 = document.getElementById("dynamic-button-3"); // KITS24BY7
  const button4 = document.getElementById("dynamic-button-5"); // History button

  const buttonStudentLogin = document.getElementById("dynamic-button-4"); // KITS(S) Student Login
  if (buttonStudentLogin) {
    buttonStudentLogin.addEventListener("click", () => {
      window.open("https://studentprofile.kitss.edu.in/pages-login.php", "_blank");
    });
  }

  const collegeWebsiteButton = document.querySelector("a[href='index.php']"); // KITS(S) FACULTY anchor
  // Removed chatHistoryToggle as History button toggles chat history already

  if (button1) {
          button1.addEventListener("click", () => {
              window.location.href = "https://kits24by7.kitss.edu.in/pages-login.php";
          });
      }

      if (button2) {
          button2.addEventListener("click", () => {
              window.open("https://facultyp.kitss.edu.in/pages-login.php", "_blank");
          });
      }

      // Remove the duplicate declaration of button4 above and add the click event listener here instead
      // So, remove this block to avoid redeclaration error

      if (collegeWebsiteButton) {
          collegeWebsiteButton.removeEventListener("click", () => {
              window.open("https://facultyp.kitss.edu.in/pages-login.php", "_blank");
          });
      }

      if (button3) {
          button3.addEventListener("click", () => {
              window.open("https://kits24by7.kitss.edu.in/pages-login.php", "_blank");
          });
      }

      if (button4) {
          button4.addEventListener("click", () => {
              window.open("https://studentprofile.kitss.edu.in/pages-login.php", "_blank");
          });
      }

      // Function to update chat history list
      function updateHistory() {
        chatHistory.innerHTML = "";
        conversations.forEach(convo => {
          const li = document.createElement("li");
          li.textContent = convo.timestamp;
          li.dataset.id = convo.id;
          li.addEventListener("click", () => {
            currentConversationId = convo.id;
            chatBox.innerHTML = "";
            convo.messages.forEach(msg => {
              addMessage(msg.sender, msg.text);
            });
            sidebar.classList.remove("open");
            if (!isChatExpanded) {
              expandChat();
            }
          });
          chatHistory.appendChild(li);
        });
      }

      // Sidebar toggle buttons expand/collapse functionality
      const toggleButtons = document.querySelectorAll('.sidebar-toggle-button');
      toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
          const contentId = button.id.replace('-toggle', '-content');
          const content = document.getElementById(contentId);
          if (content.classList.contains('expanded')) {
            content.classList.remove('expanded');
          } else {
            content.classList.add('expanded');
            if (button.id === 'chat-history-toggle') {
              updateHistory();
            }
          }
          // Close sidebar when any sidebar toggle button is clicked
          sidebar.classList.remove('open');
          sidebarToggle.style.display = "block";
        });
      });

      // Close sidebar if click outside sidebar, chat container, and chat box
      document.addEventListener("mousedown", (event) => {
        console.log("Clicked element:", event.target);
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickInsideChatContainer = chatContainer.contains(event.target);
        const isClickInsideChatBox = chatBox.contains(event.target);
        const isClickOnSidebarToggle = sidebarToggle.contains(event.target);

        console.log("isClickInsideSidebar:", isClickInsideSidebar);
        console.log("isClickInsideChatContainer:", isClickInsideChatContainer);
        console.log("isClickInsideChatBox:", isClickInsideChatBox);
        console.log("isClickOnSidebarToggle:", isClickOnSidebarToggle);

        if (!isClickInsideSidebar && !isClickInsideChatContainer && !isClickInsideChatBox && !isClickOnSidebarToggle) {
          sidebar.classList.remove("open");
          sidebarToggle.style.display = "block";
        }
      });

      // Prevent clicks inside sidebar from closing it
      sidebar.addEventListener("mousedown", (event) => {
        event.stopPropagation();
      });
  });
