// ChatBot.tsx
import React, { useState, useEffect } from "react";
import { useChat } from "./ChatContext";

interface Message {
  message: string;
  type: "text" | "source";
}

interface Props {
  backendUrl: string;
}

const ChatBot: React.FC<Props> = ({ backendUrl }) => {
  const { messages, setMessages } = useChat();
  const [input, setInput] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en"); // Default to English

  useEffect(() => {
    // Load configuration file
    fetch("/config.json")
      .then((response) => response.json())
      .then((data) => (backendUrl = data.backendUrl))
      .catch((error) => console.error("Error loading config:", error));
  }, [backendUrl]);

  const handleSendMessage = async () => {
    if (input.trim() !== "") {
      const userMessage = input;
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: userMessage, type: "text" },
      ]);
      setInput("");

      try {
        const response = await fetch(`${backendUrl}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: userMessage, language: selectedLanguage }), // Send selected language
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        let languageMessage: Message;
        if (selectedLanguage === "ar") {
          languageMessage = {
            message: `Arabic Version: ${data.arabic_version}`,
            type: "text",
          };
        } else if (selectedLanguage === "fr") {
          languageMessage = {
            message: `French Version: ${data.french_version}`,
            type: "text",
          };
        } else {
          languageMessage = {
            message: `English Version: ${data.english_version}`,
            type: "text",
          };
        }

        const sourceMessage: Message = {
          message: `Source: ${data.source.source}`,
          type: "source",
        };

        setMessages((prevMessages) => [
          ...prevMessages,
          languageMessage,
          sourceMessage,
        ]);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: "Error: Could not reach the server", type: "text" },
        ]);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLanguage(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-700">
      <div className="flex-1 p-4 overflow-y-auto">
        <h2 className="text-2xl text-white mb-4">ChatBot</h2>
        <div className="flex flex-col gap-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                index % 2 === 0 ? "items-start" : "items-end justify-end"
              }`}
            >
              <div
                className={`rounded-lg ${
                  message.type === "source" ? "bg-gray-600" : "bg-gray-800"
                } p-2`}
              >
                <p
                  className={`text-white ${
                    message.type === "source" && "text-blue-400"
                  }`}
                >
                  {message.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-gray-800 flex items-center fixed bottom-0 w-full">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 bg-gray-900 text-white p-4 rounded-l"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="ml-2 bg-gray-900 text-white p-2 rounded"
        >
          <option value="en">English</option>
          <option value="ar">Arabic</option>
          <option value="fr">French</option>
        </select>
        <button
          className="ml-2 bg-green-500 text-white p-2 rounded-r"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
