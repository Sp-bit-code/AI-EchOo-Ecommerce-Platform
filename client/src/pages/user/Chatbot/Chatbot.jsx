import React, { useEffect, useMemo, useRef, useState } from "react";

import { sendChatMessage } from "../../../api/chatbotApi";
import useAuth from "../../../hooks/useAuth";

import "./Chatbot.css";

const QUICK_PROMPT_GROUPS = [
  {
    title: "Products",
    prompts: [
      "Show all iPhones",
      "Show phones under 50000",
      "I need gaming laptop",
      "Suggest Nothing phones",
      "Show similar products for iPhone 17",
      "Which one is cheapest?",
    ],
  },
  {
    title: "Orders",
    prompts: [
      "What is my order status?",
      "What was my last order?",
      "What was my last order product?",
      "Show my recent orders",
      "Is my order delivered?",
    ],
  },
  {
    title: "Payments & Policy",
    prompts: [
      "Is my payment paid?",
      "Show my payment status",
      "Can I return my last order?",
      "Can I cancel my order?",
      "What is refund policy?",
      "What is warranty policy?",
    ],
  },
];

const PRIVATE_QUERY_WORDS = [
  "my order",
  "order status",
  "latest order",
  "last order",
  "recent orders",
  "order history",
  "my payment",
  "payment status",
  "paid or pending",
  "refund status",
  "my cart",
  "my wishlist",
  "return my last order",
  "cancel my order",
  "order delivered",
];

const createMessage = ({ role, content, meta = null }) => {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
    meta,
    createdAt: new Date().toISOString(),
  };
};

const isPrivateQuery = (text) => {
  const cleanText = String(text || "").toLowerCase();
  return PRIVATE_QUERY_WORDS.some((word) => cleanText.includes(word));
};

const makeChatHistoryForApi = (messages) => {
  return messages
    .filter((item) => item.role === "user" || item.role === "assistant")
    .slice(-12)
    .map((item) => ({
      role: item.role,
      content: item.content,
    }));
};

const cleanUrlText = (url) => {
  return String(url || "").replace(/[),.]+$/, "");
};

const renderInlineText = (text) => {
  const value = String(text || "");
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const boldRegex = /\*\*(.*?)\*\*/g;

  const parts = value.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      const cleanUrl = cleanUrlText(part);
      const suffix = part.slice(cleanUrl.length);

      return (
        <React.Fragment key={`${part}-${index}`}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noreferrer"
            className="chatbot-message-link"
          >
            Open link
          </a>
          {suffix}
        </React.Fragment>
      );
    }

    const boldParts = part.split(boldRegex);

    return boldParts.map((boldPart, boldIndex) => {
      const isBold = boldIndex % 2 === 1;

      if (isBold) {
        return <strong key={`${part}-${index}-${boldIndex}`}>{boldPart}</strong>;
      }

      return (
        <React.Fragment key={`${part}-${index}-${boldIndex}`}>
          {boldPart}
        </React.Fragment>
      );
    });
  });
};

const formatMessageText = (text) => {
  const lines = String(text || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return <p className="chatbot-normal-line">No response.</p>;
  }

  return lines.map((line, index) => {
    const isProductLine = /^\d+\./.test(line);
    const isPriceHeading =
      /price comparison/i.test(line) ||
      /best deal/i.test(line) ||
      /trusted online prices found/i.test(line);
    const isLinkLine = /^link:/i.test(line);
    const isEchooLinkLine = /^echoo product link:/i.test(line);
    const isBestDealLinkLine = /^best deal link:/i.test(line);

    if (isLinkLine || isEchooLinkLine || isBestDealLinkLine) {
      const url = cleanUrlText(
        line
          .replace(/^link:\s*/i, "")
          .replace(/^echoo product link:\s*/i, "")
          .replace(/^best deal link:\s*/i, "")
          .trim()
      );

      return (
        <p key={index} className="chatbot-link-line">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="chatbot-message-link"
          >
            View product
          </a>
        </p>
      );
    }

    return (
      <p
        key={index}
        className={[
          "chatbot-normal-line",
          isProductLine ? "chatbot-product-line" : "",
          isPriceHeading ? "chatbot-heading-line" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {renderInlineText(line)}
      </p>
    );
  });
};

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`chatbot-message-row ${
        isUser ? "chatbot-message-row-user" : "chatbot-message-row-ai"
      }`}
    >
      <div
        className={`chatbot-message-bubble ${
          isUser ? "chatbot-message-user" : "chatbot-message-ai"
        }`}
      >
        {isAssistant && <div className="chatbot-message-label">Echoo AI</div>}

        <div className="chatbot-message-text">
          {formatMessageText(message.content)}
        </div>

        {message.meta?.intent && (
          <div className="chatbot-message-meta">
            Intent: {message.meta.intent}
          </div>
        )}
      </div>
    </div>
  );
};

const Chatbot = () => {
  const { user, isAuthenticated } = useAuth();

  const [messages, setMessages] = useState(() => [
    createMessage({
      role: "assistant",
      content:
        "Hi! I am Echoo AI. Ask me about products, specifications, colors, price comparison, orders, payments, returns, refunds, warranty, or delivery.",
      meta: {
        intent: "welcome",
      },
    }),
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [errorText, setErrorText] = useState("");

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const displayName = useMemo(() => {
    return user?.name || user?.full_name || user?.email || "User";
  }, [user]);

  const userId = useMemo(() => {
    return user?.id || user?.user_id || user?.uid || user?.authUser?.id || null;
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, sending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (customMessage = "") => {
    const finalMessage = String(customMessage || input || "").trim();

    if (!finalMessage || sending) {
      return;
    }

    setErrorText("");

    if (isPrivateQuery(finalMessage) && !isAuthenticated) {
      setMessages((prev) => [
        ...prev,
        createMessage({
          role: "user",
          content: finalMessage,
        }),
        createMessage({
          role: "assistant",
          content:
            "Please sign in first so I can securely check your orders, payments, cart, wishlist, or refund status.",
          meta: {
            intent: "auth_required",
          },
        }),
      ]);
      setInput("");
      return;
    }

    const userMessage = createMessage({
      role: "user",
      content: finalMessage,
    });

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const result = await sendChatMessage({
        message: finalMessage,
        userId,
        user,
        chatHistory: makeChatHistoryForApi(nextMessages),
      });

      const assistantMessage = createMessage({
        role: "assistant",
        content:
          result?.message ||
          result?.response ||
          result?.answer ||
          "I could not get a response right now.",
        meta: {
          intent: result?.intent || "unknown",
          source: result?.data?.response_source || "",
          success: result?.success,
        },
      });

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chatbot send error:", error);

      setErrorText("Something went wrong. Please try again.");

      setMessages((prev) => [
        ...prev,
        createMessage({
          role: "assistant",
          content:
            "I could not connect to Echoo AI right now. Please try again in a moment.",
          meta: {
            intent: "frontend_error",
          },
        }),
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      createMessage({
        role: "assistant",
        content:
          "Chat cleared. Ask me about products, price comparison, orders, payments, returns, refunds, warranty, or delivery.",
        meta: {
          intent: "welcome",
        },
      }),
    ]);
    setErrorText("");
    setInput("");
  };

  return (
    <main className="chatbot-page">
      <section className="chatbot-hero">
        <div>
          <p className="chatbot-eyebrow">Echoo Assistant</p>
          <h1>AI Commerce Chat</h1>
          <p>
            Search products, compare prices, check specs, and ask account
            questions after login.
          </p>
        </div>

        <div className="chatbot-user-card">
          <span className="chatbot-user-dot"></span>
          <div>
            <p>{isAuthenticated ? "Signed in" : "Guest mode"}</p>
            <strong>{isAuthenticated ? displayName : "Login required for orders"}</strong>
          </div>
        </div>
      </section>

      <section className="chatbot-shell">
        <div className="chatbot-header">
          <div>
            <h2>Chat with Echoo AI</h2>
            <p>
              Product questions work anytime. Order and payment questions use
              your logged-in account.
            </p>
          </div>

          <button
            type="button"
            className="chatbot-clear-btn"
            onClick={clearChat}
          >
            Clear
          </button>
        </div>

        <div className="chatbot-main-area">
          <aside className="chatbot-prompt-sidebar">
            <div className="chatbot-prompt-sidebar-head">
              <h3>Quick Questions</h3>
              <p>Tap any question to ask instantly.</p>
            </div>

            <div className="chatbot-quick-prompts">
              {QUICK_PROMPT_GROUPS.map((group) => (
                <div key={group.title} className="chatbot-prompt-group">
                  <p className="chatbot-prompt-title">{group.title}</p>

                  <div className="chatbot-prompt-list">
                    {group.prompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        disabled={sending}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="chatbot-chat-area">
            <div className="chatbot-window">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {sending && (
                <div className="chatbot-message-row chatbot-message-row-ai">
                  <div className="chatbot-message-bubble chatbot-message-ai">
                    <div className="chatbot-message-label">Echoo AI</div>
                    <div className="chatbot-typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={scrollRef}></div>
            </div>

            {errorText && <div className="chatbot-error">{errorText}</div>}

            <form className="chatbot-input-area" onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about products, price comparison, order status, payment status..."
                rows={1}
                disabled={sending}
                spellCheck="true"
                autoCorrect="on"
                autoCapitalize="sentences"
                autoComplete="on"
              />

              <button type="submit" disabled={sending || !input.trim()}>
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Chatbot;
