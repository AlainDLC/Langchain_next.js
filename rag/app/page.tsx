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
  const noMassage = true;
  return (
    <main className="w-80 h-80 bg-gray-300 text-center  gap-2">
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
            <PromtSuggestionRow />
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
