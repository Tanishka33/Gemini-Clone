import { createContext, useState } from "react";
import runChat from "../config/gemini.js";

export const Context = createContext();

const ContextProvider = (props) => {
	const [input, setInput] = useState("");
	const [recentPrompt, setRecentPrompt] = useState("");
	const [prevPrompts, setPrevPrompts] = useState([]);
	const [showResults, setShowResults] = useState(false);
	const [loading, setLoading] = useState(false);
	const [resultData, setResultData] = useState("");
	const [error, setError] = useState(null);

	const delayPara = (index, nextWord) => {
		setTimeout(function () {
			setResultData((prev) => prev + nextWord);
		}, 10 * index);
	};
	
	const newChat = () => {
		setLoading(false);
		setShowResults(false);
		setError(null);
		setResultData("");
	};

	const onSent = async (prompt) => {
		setResultData("");
		setError(null);
		setLoading(true);
		setShowResults(true);
		
		let response;
		try {
			if (prompt !== undefined) {
				response = await runChat(prompt);
				setRecentPrompt(prompt);
			} else {
				setPrevPrompts(prev => [...prev, input]);
				setRecentPrompt(input);
				response = await runChat(input);
			}

			// Process response formatting
			// Basic formatting: support **bold** markdown and newlines
			const formatted = response
				.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
				.replace(/\n/g, "<br/>");
			
			const chars = formatted.split("");
			for (let i = 0; i < chars.length; i++) {
				const nextChar = chars[i];
				delayPara(i, nextChar);
			}
			
		} catch (error) {
			console.error("Error while running chat:", error);
			setError("Failed to get response. Please check your API key and try again.");
			setResultData("Sorry, there was an error processing your request. Please try again.");
		} finally {
			setLoading(false);
			setInput("");
		}
	};

	const contextValue = {
		prevPrompts,
		setPrevPrompts,
		onSent,
		setRecentPrompt,
		recentPrompt,
		input,
		setInput,
		showResults,
		loading,
		resultData,
		newChat,
		error,
	};

	return (
		<Context.Provider value={contextValue}>{props.children}</Context.Provider>
	);
};

export default ContextProvider;