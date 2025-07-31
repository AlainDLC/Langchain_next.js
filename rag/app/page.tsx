/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import logo from "../app/assets/a.jpeg";
import { useChat } from "@ai-sdk/react";
import { Message } from "ai";
import PromtSuggestionRow from "./components/PromtSuggestionRow";
import LoadingBubble from "./components/LoadingBubble";
import Bubble from "./components/Bubble";

const Home = () => {
  const { append, status, messages, input, handleInputChange, handleSubmit } =
    useChat();
  const noMassage = !messages || messages.length === 0;

  const handlePromt = (promptText) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    };
    append(msg as any);
  };
  return (
    <main className="w-80 h-80  text-center  gap-2 overflow-x-auto">
      <Image src={logo} width="350" alt="logo" />
      <section
        className={
          noMassage
            ? "w-full"
            : " h-full flex flex-col justify-end overflow-scroll"
        }
      >
        {noMassage ? (
          <>
            <p className="text-xl text-slate-600 p-0">
              Ask F1Gpt about Formula
            </p>
            <br />
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}
            <PromtSuggestionRow onPromtClick={handlePromt} />
          </>
        ) : (
          <>{status === "ready" && <LoadingBubble />}</>
        )}
      </section>
      <form onSubmit={handleSubmit}>
        <input
          className=""
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something..."
        />
        <input type="submit" />
      </form>
    </main>
  );
};

export default Home;
