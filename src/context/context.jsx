import { createContext, useState } from "react";
import run from "../config/gemini.js";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData(prev => prev+nextWord);
    }, 75*index)
  }

  const newChat = () => {
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResultData(""); // Clear previous result
    setLoading(true); // Show loading state
    setShowResult(true); // Show the result section
    let response = "";
    if (prompt !== undefined){
      response = await run(prompt); 
      setRecentPrompt(prompt);
      setInput("")
    }
    else {
      setPrevPrompts(prev => [...prev, input])
      setRecentPrompt(input)
      response = await run(input)
      setInput("")
    }
     // Store the current input
    
    try {
      const formattedResponse = response
        .split("**")
        .map((part, index) =>
          index % 2 === 1 ? `<b>${part}</b>` : part
        )
        .join(""); // Combine the response with <b> tags
        let newResponse = formattedResponse.split("*").join("</br>")

      // Set the formatted response
      let newResponseArray = newResponse.split(" ");
      for(let i=0; i<newResponseArray.length; i++){
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord+" ")
      }
    } catch (error) {
      console.error("Error in onSent:", error);
      setResultData("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Hide loading state
      setInput(""); // Clear input field
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
