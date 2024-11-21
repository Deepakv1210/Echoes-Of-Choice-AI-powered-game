// import React, { useState, useEffect } from 'react';
// import Button from './components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
// import './Game.css';

// const Game = () => {
//   // Local LLM states
//   const initialStory = `
//     You are Raoul Silva, a former MI6 agent with a personal vendetta against M. The memory of betrayal burns within you as you plan your next move. In your secluded hideout, screens display live feeds of MI6 activities. The stolen hard drive containing NATO agents' information is in your possession, and it's time to set your plan in motion.
//   `;

//   const initialChoices = [
//     {
//       short_description: "Launch a cyber attack on MI6's mainframe",
//       actual_choice: "You decide to exploit their network weaknesses.",
//       attributes: { strategy: +2, deception: +1 },
//     },
//     {
//       short_description: 'Kidnap a key MI6 agent for leverage',
//       actual_choice: 'You aim to gain valuable information.',
//       attributes: { cunning: +2, ruthlessness: +1 },
//     },
//     {
//       short_description: 'Plant misinformation to mislead MI6',
//       actual_choice: 'You attempt to throw them off your trail.',
//       attributes: { deception: +2, strategy: +1 },
//     },
//   ];

//   // Common states
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [gameStarted, setGameStarted] = useState(false);
//   const [gameOver, setGameOver] = useState(false);

//   // States for Local LLM game
//   const [story, setStory] = useState(initialStory);
//   const [latestStorySegment, setLatestStorySegment] = useState(initialStory);
//   const [choices, setChoices] = useState(initialChoices);
//   const [choiceHistory, setChoiceHistory] = useState([
//     { story: initialStory, choice: 'Initial Story', timeTaken: 0 },
//   ]);
//   const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
//   const [loading, setLoading] = useState(false);

//   // Player attributes state for Local LLM
//   const [playerAttributes, setPlayerAttributes] = useState({
//     cunning: 0,
//     ruthlessness: 0,
//     deception: 0,
//     strategy: 0,
//     ambition: 0,
//   });

//   // Time tracking state for Local LLM
//   const [startTime, setStartTime] = useState(null);

//   // Assistant API states
//   const [threadId, setThreadId] = useState(null);
//   const [assistantMessage, setAssistantMessage] = useState('');
//   const [userInput, setUserInput] = useState('');
//   const [conversationHistory, setConversationHistory] = useState([]);
//   const [assistantMessageTime, setAssistantMessageTime] = useState(null);

//   // Start the timer when choices are presented (Local LLM)
//   useEffect(() => {
//     if (!loading && !gameOver && selectedOption === 'local') {
//       setStartTime(Date.now());
//     }
//   }, [choices, loading, gameOver, selectedOption]);

//   // Start the timer when assistant message is received (Assistant API)
//   useEffect(() => {
//     if (!gameOver && selectedOption === 'api' && assistantMessage) {
//       setAssistantMessageTime(Date.now());
//     }
//   }, [assistantMessage, gameOver, selectedOption]);

//   const handleSelectOption = (option) => {
//     setSelectedOption(option);
//     if (option === 'local') {
//       setGameStarted(true);
//     } else if (option === 'api') {
//       // Start conversation with Assistant API
//       startAssistantConversation();
//     }
//   };

//   // Local LLM handlers
//   const handleChoice = async (choice) => {
//     if (currentBreakpoint >= 9) {
//       handleEndGame();
//       return;
//     }

//     // Stop the timer and calculate time taken
//     const endTime = Date.now();
//     const timeTaken = (endTime - startTime) / 1000; // in seconds

//     setLoading(true);

//     try {
//       const accumulatedChoices = choiceHistory
//         .map((entry) => entry.choice)
//         .filter((choice) => choice !== 'Initial Story');

//       // Update player attributes
//       setPlayerAttributes((prevAttributes) => {
//         const newAttributes = { ...prevAttributes };
//         for (let attr in choice.attributes) {
//           newAttributes[attr] += choice.attributes[attr];
//         }
//         return newAttributes;
//       });

//       // Send the current story, choice, and choice history to the backend
//       const response = await fetch('http://localhost:5000/generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           story: story,
//           choice: choice.actual_choice,
//           current_breakpoint: currentBreakpoint,
//           choice_history: accumulatedChoices,
//         }),
//       });

//       const data = await response.json();
//       const newStory =
//         data.new_story ||
//         'The story continues, but its details remain shrouded in mystery...';
//       const newChoices = data.new_choices || [];

//       if (newChoices.length === 0) {
//         alert('No new choices were generated. Ending the game.');
//         handleEndGame();
//         return;
//       }

//       // Update choices with attributes
//       const choicesWithAttributes = newChoices.map((choice) => ({
//         short_description: choice.short_description,
//         actual_choice: choice.actual_choice,
//         attributes: choice.attributes,
//       }));

//       // Update the story context based on the chosen path
//       setStory((prevStory) => `${prevStory}\n\n${newStory}`);
//       setLatestStorySegment(newStory);

//       // Update choices with the new ones
//       setChoices(choicesWithAttributes);

//       // Update choice history with the new choice, corresponding story segment, and time taken
//       setChoiceHistory((prevHistory) => [
//         ...prevHistory,
//         { choice: choice.short_description, story: newStory, timeTaken },
//       ]);

//       setCurrentBreakpoint((prev) => prev + 1);
//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred while generating the story. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEndGame = () => {
//     // Generate player profile
//     const sortedAttributes = Object.entries(playerAttributes)
//       .filter(([attr, score]) => score !== 0)
//       .sort((a, b) => b[1] - a[1]);

//     // Update choice history to include the profile
//     setChoiceHistory((prevHistory) => [
//       ...prevHistory,
//       { gameplay: story },
//       { profile: sortedAttributes },
//     ]);

//     setGameOver(true);
//   };

//   // Assistant API handlers
//   const startAssistantConversation = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/start_conversation', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: 'Start' }),
//       });
//       const data = await response.json();
//       setThreadId(data.thread_id);
//       setAssistantMessage(data.assistant_message);

//       // Record the time when the assistant's message is received
//       setAssistantMessageTime(Date.now());

//       // Initialize conversation history
//       setConversationHistory([
//         { role: 'assistant', content: data.assistant_message },
//       ]);
//     } catch (error) {
//       console.error('Error starting conversation:', error);
//     }
//   };

//   const sendMessageToAssistant = async () => {
//     if (!userInput.trim()) return;

//     // Stop the timer and calculate time taken
//     const endTime = Date.now();
//     const timeTaken = (endTime - assistantMessageTime) / 1000; // in seconds

//     try {
//       // Update conversation history with user's message and time taken
//       setConversationHistory((prev) => [
//         ...prev,
//         { role: 'user', content: userInput, timeTaken },
//       ]);

//       const response = await fetch('http://localhost:5000/send_message', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ thread_id: threadId, message: userInput }),
//       });
//       const data = await response.json();
//       setAssistantMessage(data.assistant_message);

//       // Record the time when the assistant's message is received
//       setAssistantMessageTime(Date.now());

//       // Update conversation history with assistant's message
//       setConversationHistory((prev) => [
//         ...prev,
//         { role: 'assistant', content: data.assistant_message },
//       ]);

//       // Check for game over condition
//       if (data.assistant_message.toLowerCase().includes('game over')) {
//         handleEndGameAssistant();
//       }

//       setUserInput('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   const handleEndGameAssistant = () => {
//     setGameOver(true);
//   };

//   // Render logic
//   if (!selectedOption) {
//     // Front page with two options
//     return (
//       <div className="front-screen">
//         <div className="front-title-box">
//           <h1 className="front-title">Echoes of Choice</h1>
//           <Button
//             className="start-button"
//             onClick={() => handleSelectOption('local')}
//           >
//             Use Local LLM
//           </Button>
//           <Button
//             className="start-button"
//             onClick={() => handleSelectOption('api')}
//           >
//             Use Assistant API
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // Assistant API game over screen
//   if (selectedOption === 'api' && gameOver) {
//     // Calculate average decision time
//     const timeTakenList = conversationHistory
//       .filter((entry) => entry.role === 'user' && entry.timeTaken !== undefined)
//       .map((entry) => entry.timeTaken);

//     const totalTime = timeTakenList.reduce((acc, time) => acc + time, 0);
//     const averageTime = (totalTime / timeTakenList.length).toFixed(2);

//     // Provide feedback based on average decision time
//     let decisionSpeedFeedback = '';
//     if (averageTime < 5) {
//       decisionSpeedFeedback =
//         'You made decisions quickly, indicating an impulsive decision-making style.';
//     } else if (averageTime < 15) {
//       decisionSpeedFeedback =
//         'You took a moderate amount of time to make decisions, showing a balanced decision-making approach.';
//     } else {
//       decisionSpeedFeedback =
//         'You took your time with decisions, reflecting a careful and deliberate decision-making style.';
//     }

//     return (
//       <div className="game-over-container">
//         <h2>Game Over - Your Story Journey</h2>
//         {conversationHistory.map((entry, index) => (
//           <div key={index} style={{ marginBottom: '1rem' }}>
//             {entry.role === 'user' && (
//               <>
//                 <p>
//                   <strong>Your Choice:</strong> {entry.content}
//                 </p>
//                 {entry.timeTaken !== undefined && (
//                   <p>
//                     <strong>Time Taken:</strong> {entry.timeTaken.toFixed(2)}{' '}
//                     seconds
//                   </p>
//                 )}
//               </>
//             )}
//             {entry.role === 'assistant' && (
//               <p>
//                 <strong>Assistant:</strong> {entry.content}
//               </p>
//             )}
//             {index < conversationHistory.length - 1 && <hr />}
//           </div>
//         ))}
//         <h3>Decision Speed Analysis</h3>
//         <p>
//           <strong>Average Decision Time:</strong> {averageTime} seconds
//         </p>
//         <p>{decisionSpeedFeedback}</p>
//         <Button onClick={() => window.location.reload()}>Start Over</Button>
//       </div>
//     );
//   }

//   // Assistant API interaction page
//   if (selectedOption === 'api' && threadId && !gameOver) {
//     return (
//       <div className="assistant-page">
//         <div className="message-container">
//           <div className="assistant-message">
//             <p>{assistantMessage}</p>
//           </div>
//           <div className="input-container">
//             <input
//               type="text"
//               placeholder="Your choice..."
//               value={userInput}
//               onChange={(e) => setUserInput(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && sendMessageToAssistant()}
//             />
//             <Button onClick={sendMessageToAssistant}>Send</Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Local LLM game over screen
//   if (gameOver && selectedOption === 'local') {
//     // Calculate average decision time
//     const timeTakenList = choiceHistory
//       .filter((entry) => entry.timeTaken !== undefined)
//       .map((entry) => entry.timeTaken);

//     const totalTime = timeTakenList.reduce((acc, time) => acc + time, 0);
//     const averageTime = (totalTime / timeTakenList.length).toFixed(2);

//     // Provide feedback based on average decision time
//     let decisionSpeedFeedback = '';
//     if (averageTime < 5) {
//       decisionSpeedFeedback =
//         'You made decisions quickly, indicating an impulsive decision-making style.';
//     } else if (averageTime < 15) {
//       decisionSpeedFeedback =
//         'You took a moderate amount of time to make decisions, showing a balanced decision-making approach.';
//     } else {
//       decisionSpeedFeedback =
//         'You took your time with decisions, reflecting a careful and deliberate decision-making style.';
//     }

//     return (
//       <div className="game-over-container">
//         <h2>Game Over - Your Story Journey</h2>
//         {choiceHistory.map((entry, index) => (
//           <div key={index} style={{ marginBottom: '1rem' }}>
//             {entry.choice !== 'Initial Story' && entry.choice && (
//               <>
//                 <p>
//                   <strong>Your Choice:</strong> {entry.choice}
//                 </p>
//                 <p>
//                   <strong>Time Taken:</strong> {entry.timeTaken.toFixed(2)}{' '}
//                   seconds
//                 </p>
//               </>
//             )}
//             {entry.story && (
//               <p>
//                 <strong>Story Segment:</strong> {entry.story}
//               </p>
//             )}
//             {entry.gameplay && (
//               <>
//                 <h3>Your Complete Story:</h3>
//                 <p>{entry.gameplay}</p>
//               </>
//             )}
//             {entry.profile && (
//               <>
//                 <h3>Your Character Profile:</h3>
//                 {entry.profile.map(([attr, score]) => (
//                   <p key={attr}>
//                     {attr.charAt(0).toUpperCase() + attr.slice(1)}: {score}
//                   </p>
//                 ))}
//               </>
//             )}
//             {index < choiceHistory.length - 1 && <hr />}
//           </div>
//         ))}
//         <h3>Decision Speed Analysis</h3>
//         <p>
//           <strong>Average Decision Time:</strong> {averageTime} seconds
//         </p>
//         <p>{decisionSpeedFeedback}</p>
//         <Button onClick={() => window.location.reload()}>Start Over</Button>
//       </div>
//     );
//   }

//   // Local LLM game screen
//   if (gameStarted && selectedOption === 'local') {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Interactive Story Game</CardTitle>
//         </CardHeader>
//         <CardContent className="text-container">
//           <div className="story-container">
//             <p className="story-segment">{latestStorySegment}</p>
//           </div>
//           <div className="choice-container">
//             {loading ? (
//               <p>Loading...</p>
//             ) : (
//               choices.map((choice, index) => (
//                 <Button
//                   key={index}
//                   className="choice-button"
//                   onClick={() => handleChoice(choice)}
//                 >
//                   {choice.short_description}
//                 </Button>
//               ))
//             )}
//             <Button className="button-game-over" onClick={handleEndGame}>
//               End Game
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Loading state or default
//   return <div>Loading...</div>;
// };

// export default Game;



//---------------------BG Image--------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import Button from './components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
// import './Game.css';

// const Game = () => {
//   const initialStory = `
//     You are Raoul Silva, a former MI6 agent with a personal vendetta against M. The memory of betrayal burns within you as you plan your next move. In your secluded hideout, screens display live feeds of MI6 activities. The stolen hard drive containing NATO agents' information is in your possession, and it's time to set your plan in motion.
//   `;

//   const initialChoices = [
//     { 
//       short_description: "Launch a cyber attack on MI6's mainframe", 
//       actual_choice: "You decide to exploit their network weaknesses.", 
//       attributes: { strategy: +2, deception: +1 } 
//     },
//     { 
//       short_description: "Kidnap a key MI6 agent for leverage", 
//       actual_choice: "You aim to gain valuable information.", 
//       attributes: { cunning: +2, ruthlessness: +1 } 
//     },
//     { 
//       short_description: "Plant misinformation to mislead MI6", 
//       actual_choice: "You attempt to throw them off your trail.", 
//       attributes: { deception: +2, strategy: +1 } 
//     }
//   ];

//   const [story, setStory] = useState(initialStory);
//   const [latestStorySegment, setLatestStorySegment] = useState(initialStory);
//   const [choices, setChoices] = useState(initialChoices);
//   const [choiceHistory, setChoiceHistory] = useState([{ story: initialStory, choice: "Initial Story", timeTaken: 0 }]);
//   const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [gameStarted, setGameStarted] = useState(false);

//   // Player attributes state
//   // const [playerAttributes, setPlayerAttributes] = useState({
//   //   bravery: 0,
//   //   wisdom: 0,
//   //   curiosity: 0,
//   //   caution: 0,
//   //   resourcefulness: 0,
//   // });
//   const [playerAttributes, setPlayerAttributes] = useState({
//     cunning: 0,
//     ruthlessness: 0,
//     deception: 0,
//     strategy: 0,
//     ambition: 0,
//   });
//   // Time tracking state
//   const [startTime, setStartTime] = useState(null);

//   // Start the timer when choices are presented
//   useEffect(() => {
//     if (!loading && !gameOver) {
//       setStartTime(Date.now());
//     }
//   }, [choices, loading, gameOver]);

//   const handleChoice = async (choice) => {
//     if (currentBreakpoint >= 9) {
//       handleEndGame();
//       return;
//     }

//     // Stop the timer and calculate time taken
//     const endTime = Date.now();
//     const timeTaken = (endTime - startTime) / 1000; // in seconds

//     setLoading(true);

//     try {
//       const accumulatedChoices = choiceHistory.map(entry => entry.choice).filter(choice => choice !== "Initial Story");

//       // Update player attributes
//       setPlayerAttributes(prevAttributes => {
//         const newAttributes = { ...prevAttributes };
//         for (let attr in choice.attributes) {
//           newAttributes[attr] += choice.attributes[attr];
//         }
//         return newAttributes;
//       });

//       // Send the current story, choice, and choice history to the backend
//       const response = await fetch('http://localhost:5000/generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           story: story, 
//           choice: choice.actual_choice, 
//           current_breakpoint: currentBreakpoint,
//           choice_history: accumulatedChoices
//         }),
//       });

//       const data = await response.json();
//       const newStory = data.new_story || "The story continues, but its details remain shrouded in mystery...";
//       const newChoices = data.new_choices || [];

//       if (newChoices.length === 0) {
//         alert("No new choices were generated. Ending the game.");
//         handleEndGame();
//         return;
//       }

//       // Update choices with attributes
//       const choicesWithAttributes = newChoices.map(choice => ({
//         short_description: choice.short_description,
//         actual_choice: choice.actual_choice,
//         attributes: choice.attributes
//       }));

//       // Update the story context based on the chosen path
//       setStory(prevStory => `${prevStory}\n\n${newStory}`);
//       setLatestStorySegment(newStory);

//       // Update choices with the new ones
//       setChoices(choicesWithAttributes);

//       // Update choice history with the new choice, corresponding story segment, and time taken
//       setChoiceHistory(prevHistory => [
//         ...prevHistory,
//         { choice: choice.short_description, story: newStory, timeTaken }
//       ]);

//       setCurrentBreakpoint(prev => prev + 1);

//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred while generating the story. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEndGame = () => {
//     // Generate player profile
//     const sortedAttributes = Object.entries(playerAttributes)
//       .filter(([attr, score]) => score !== 0)
//       .sort((a, b) => b[1] - a[1]);

//     // Update choice history to include the profile
//     setChoiceHistory(prevHistory => [
//       ...prevHistory,
//       { gameplay: story },
//       { profile: sortedAttributes }
//     ]);

//     setGameOver(true);
//   };

//   const handleStartGame = () => {
//     setGameStarted(true);
//   };

//   if (!gameStarted) {
//     return (
//       <div className="front-screen">
//         <div className="front-title-box">
//           <h1 className="front-title">Skyfall: The Antagonist's Path</h1>
//           <p className="front-description">
//             Step into the shoes of Raoul Silva, a mastermind with a score to settle. Craft your strategy, make pivotal decisions, and alter the fate of those who once betrayed you.
//           </p>
//           <Button className="start-button" onClick={handleStartGame}>
//             Begin Your Mission
//           </Button>
//         </div>
//       </div>
//     );
//   }


//   if (gameOver) {
//     // Calculate average decision time
//     const timeTakenList = choiceHistory
//       .filter(entry => entry.timeTaken !== undefined)
//       .map(entry => entry.timeTaken);

//     const totalTime = timeTakenList.reduce((acc, time) => acc + time, 0);
//     const averageTime = (totalTime / timeTakenList.length).toFixed(2);

//     // Provide feedback based on average decision time
//     let decisionSpeedFeedback = '';
//     if (averageTime < 5) {
//       decisionSpeedFeedback = 'You made decisions quickly, indicating an impulsive decision-making style.';
//     } else if (averageTime < 15) {
//       decisionSpeedFeedback = 'You took a moderate amount of time to make decisions, showing a balanced decision-making approach.';
//     } else {
//       decisionSpeedFeedback = 'You took your time with decisions, reflecting a careful and deliberate decision-making style.';
//     }

//     return (
//       <div className="game-over-container">
//         <h2>Game Over - Your Story Journey</h2>
//         {choiceHistory.map((entry, index) => (
//           <div key={index} style={{ marginBottom: '1rem' }}>
//             {entry.choice !== "Initial Story" && entry.choice && (
//               <>
//                 <p><strong>Your Choice:</strong> {entry.choice}</p>
//                 <p><strong>Time Taken:</strong> {entry.timeTaken.toFixed(2)} seconds</p>
//               </>
//             )}
//             {entry.story && (
//               <p><strong>Story Segment:</strong> {entry.story}</p>
//             )}
//             {entry.gameplay && (
//               <>
//                 <h3>Your Complete Story:</h3>
//                 <p>{entry.gameplay}</p>
//               </>
//             )}
//             {entry.profile && (
//               <>
//                 <h3>Your Character Profile:</h3>
//                 {entry.profile.map(([attr, score]) => (
//                   <p key={attr}>{attr.charAt(0).toUpperCase() + attr.slice(1)}: {score}</p>
//                 ))}
//               </>
//             )}
//             {index < choiceHistory.length - 1 && <hr />}
//           </div>
//         ))}
//         <h3>Decision Speed Analysis</h3>
//         <p><strong>Average Decision Time:</strong> {averageTime} seconds</p>
//         <p>{decisionSpeedFeedback}</p>
//         <Button onClick={() => window.location.reload()}>Start Over</Button>
//       </div>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Interactive Story Game</CardTitle>
//       </CardHeader>
//       <CardContent className="text-container">
//         <div className="story-container">
//           <p className="story-segment">{latestStorySegment}</p>
//         </div>
//         <div className="choice-container">
//           {loading ? (
//             <p>Loading...</p>
//           ) : (
//             choices.map((choice, index) => (
//               <Button key={index} className="choice-button" onClick={() => handleChoice(choice)}>
//                 {choice.short_description}
//               </Button>
//             ))
//           )}
//           <Button className="button-game-over" onClick={handleEndGame}>End Game</Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default Game;


//Final -----------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import Button from './components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
// import './Game.css';

// const Game = () => {
//   // Local LLM states
//   const initialStory = `
//     You are Raoul Silva, a former MI6 agent with a personal vendetta against M. The memory of betrayal burns within you as you plan your next move. In your secluded hideout, screens display live feeds of MI6 activities. The stolen hard drive containing NATO agents' information is in your possession, and it's time to set your plan in motion.
//   `;

//   const initialChoices = [
//     { 
//       short_description: "Launch a cyber attack on MI6's mainframe", 
//       actual_choice: "You decide to exploit their network weaknesses.", 
//       attributes: { strategy: +2, deception: +1 } 
//     },
//     { 
//       short_description: "Kidnap a key MI6 agent for leverage", 
//       actual_choice: "You aim to gain valuable information.", 
//       attributes: { cunning: +2, ruthlessness: +1 } 
//     },
//     { 
//       short_description: "Plant misinformation to mislead MI6", 
//       actual_choice: "You attempt to throw them off your trail.", 
//       attributes: { deception: +2, strategy: +1 } 
//     }
//   ];

//   // Common states
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [gameStarted, setGameStarted] = useState(false);

//   // States for Local LLM game
//   const [story, setStory] = useState(initialStory);
//   const [latestStorySegment, setLatestStorySegment] = useState(initialStory);
//   const [choices, setChoices] = useState(initialChoices);
//   const [choiceHistory, setChoiceHistory] = useState([{ story: initialStory, choice: "Initial Story", timeTaken: 0 }]);
//   const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Player attributes state for Local LLM
//   const [playerAttributes, setPlayerAttributes] = useState({
//     cunning: 0,
//     ruthlessness: 0,
//     deception: 0,
//     strategy: 0,
//     ambition: 0,
//   });

//   // Time tracking state for Local LLM
//   const [startTime, setStartTime] = useState(null);

//   // Assistant API states
//   const [threadId, setThreadId] = useState(null);
//   const [assistantMessage, setAssistantMessage] = useState('');
//   const [userInput, setUserInput] = useState('');
//   const [conversationHistory, setConversationHistory] = useState([]);

//   // Start the timer when choices are presented (Local LLM)
//   useEffect(() => {
//     if (!loading && !gameOver && selectedOption === 'local') {
//       setStartTime(Date.now());
//     }
//   }, [choices, loading, gameOver, selectedOption]);

//   const handleSelectOption = (option) => {
//     setSelectedOption(option);
//     if (option === 'local') {
//       setGameStarted(true);
//     } else if (option === 'api') {
//       // Start conversation with Assistant API
//       startAssistantConversation();
//     }
//   };

//   // Local LLM handlers
//   const handleChoice = async (choice) => {
//     if (currentBreakpoint >= 9) {
//       handleEndGame();
//       return;
//     }

//     // Stop the timer and calculate time taken
//     const endTime = Date.now();
//     const timeTaken = (endTime - startTime) / 1000; // in seconds

//     setLoading(true);

//     try {
//       const accumulatedChoices = choiceHistory.map(entry => entry.choice).filter(choice => choice !== "Initial Story");

//       // Update player attributes
//       setPlayerAttributes(prevAttributes => {
//         const newAttributes = { ...prevAttributes };
//         for (let attr in choice.attributes) {
//           newAttributes[attr] += choice.attributes[attr];
//         }
//         return newAttributes;
//       });

//       // Send the current story, choice, and choice history to the backend
//       const response = await fetch('http://localhost:5000/generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           story: story, 
//           choice: choice.actual_choice, 
//           current_breakpoint: currentBreakpoint,
//           choice_history: accumulatedChoices
//         }),
//       });

//       const data = await response.json();
//       const newStory = data.new_story || "The story continues, but its details remain shrouded in mystery...";
//       const newChoices = data.new_choices || [];

//       if (newChoices.length === 0) {
//         alert("No new choices were generated. Ending the game.");
//         handleEndGame();
//         return;
//       }

//       // Update choices with attributes
//       const choicesWithAttributes = newChoices.map(choice => ({
//         short_description: choice.short_description,
//         actual_choice: choice.actual_choice,
//         attributes: choice.attributes
//       }));

//       // Update the story context based on the chosen path
//       setStory(prevStory => `${prevStory}\n\n${newStory}`);
//       setLatestStorySegment(newStory);

//       // Update choices with the new ones
//       setChoices(choicesWithAttributes);

//       // Update choice history with the new choice, corresponding story segment, and time taken
//       setChoiceHistory(prevHistory => [
//         ...prevHistory,
//         { choice: choice.short_description, story: newStory, timeTaken }
//       ]);

//       setCurrentBreakpoint(prev => prev + 1);

//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred while generating the story. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEndGame = () => {
//     // Generate player profile
//     const sortedAttributes = Object.entries(playerAttributes)
//       .filter(([attr, score]) => score !== 0)
//       .sort((a, b) => b[1] - a[1]);

//     // Update choice history to include the profile
//     setChoiceHistory(prevHistory => [
//       ...prevHistory,
//       { gameplay: story },
//       { profile: sortedAttributes }
//     ]);

//     setGameOver(true);
//   };

//   // Assistant API handlers
//   const startAssistantConversation = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/start_conversation', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: 'Start' }),
//       });
//       const data = await response.json();
//       setThreadId(data.thread_id);
//       setAssistantMessage(data.assistant_message);
//       setConversationHistory([
//         { role: 'assistant', content: data.assistant_message },
//       ]);
//     } catch (error) {
//       console.error('Error starting conversation:', error);
//     }
//   };

//   const sendMessageToAssistant = async () => {
//     if (!userInput.trim()) return;
//     try {
//       // Update conversation history with user's message
//       setConversationHistory((prev) => [
//         ...prev,
//         { role: 'user', content: userInput },
//       ]);

//       const response = await fetch('http://localhost:5000/send_message', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ thread_id: threadId, message: userInput }),
//       });
//       const data = await response.json();
//       setAssistantMessage(data.assistant_message);

//       // Update conversation history with assistant's message
//       setConversationHistory((prev) => [
//         ...prev,
//         { role: 'assistant', content: data.assistant_message },
//       ]);

//       setUserInput('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };
  


//   // Render logic
//   if (!selectedOption) {
//     // Front page with two options
//     return (
//       <div className="front-screen">
//         <div className="front-title-box">
//           <h1 className="front-title">Echoes of Choice</h1>
//           <Button className="start-button" onClick={() => handleSelectOption('local')}>
//             Use Local LLM
//           </Button>
//           <Button className="start-button" onClick={() => handleSelectOption('api')}>
//             Use Assistant API
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // Assistant API interaction page
//   if (selectedOption === 'api' && threadId) {
//     return (
//       <div className="assistant-page">
//         <div className="conversation-container">
//           {conversationHistory.map((message, index) => (
//             <div
//               key={index}
//               className={`message-bubble ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
//             >
//               <p>{message.content}</p>
//             </div>
//           ))}
//         </div>
//         <div className="input-container">
//           <input
//             type="text"
//             placeholder="Your choice..."
//             value={userInput}
//             onChange={(e) => setUserInput(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && sendMessageToAssistant()}
//           />
//           <Button onClick={sendMessageToAssistant}>Send</Button>
//         </div>
//       </div>
//     );
//   }

//   // Local LLM game over screen
//   if (gameOver && selectedOption === 'local') {
//     // Calculate average decision time
//     const timeTakenList = choiceHistory
//       .filter(entry => entry.timeTaken !== undefined)
//       .map(entry => entry.timeTaken);

//     const totalTime = timeTakenList.reduce((acc, time) => acc + time, 0);
//     const averageTime = (totalTime / timeTakenList.length).toFixed(2);

//     // Provide feedback based on average decision time
//     let decisionSpeedFeedback = '';
//     if (averageTime < 5) {
//       decisionSpeedFeedback = 'You made decisions quickly, indicating an impulsive decision-making style.';
//     } else if (averageTime < 15) {
//       decisionSpeedFeedback = 'You took a moderate amount of time to make decisions, showing a balanced decision-making approach.';
//     } else {
//       decisionSpeedFeedback = 'You took your time with decisions, reflecting a careful and deliberate decision-making style.';
//     }

//     return (
//       <div className="game-over-container">
//         <h2>Game Over - Your Story Journey</h2>
//         {choiceHistory.map((entry, index) => (
//           <div key={index} style={{ marginBottom: '1rem' }}>
//             {entry.choice !== "Initial Story" && entry.choice && (
//               <>
//                 <p><strong>Your Choice:</strong> {entry.choice}</p>
//                 <p><strong>Time Taken:</strong> {entry.timeTaken.toFixed(2)} seconds</p>
//               </>
//             )}
//             {entry.story && (
//               <p><strong>Story Segment:</strong> {entry.story}</p>
//             )}
//             {entry.gameplay && (
//               <>
//                 <h3>Your Complete Story:</h3>
//                 <p>{entry.gameplay}</p>
//               </>
//             )}
//             {entry.profile && (
//               <>
//                 <h3>Your Character Profile:</h3>
//                 {entry.profile.map(([attr, score]) => (
//                   <p key={attr}>{attr.charAt(0).toUpperCase() + attr.slice(1)}: {score}</p>
//                 ))}
//               </>
//             )}
//             {index < choiceHistory.length - 1 && <hr />}
//           </div>
//         ))}
//         <h3>Decision Speed Analysis</h3>
//         <p><strong>Average Decision Time:</strong> {averageTime} seconds</p>
//         <p>{decisionSpeedFeedback}</p>
//         <Button onClick={() => window.location.reload()}>Start Over</Button>
//       </div>
//     );
//   }

//   // Local LLM game screen
//   if (gameStarted && selectedOption === 'local') {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Interactive Story Game</CardTitle>
//         </CardHeader>
//         <CardContent className="text-container">
//           <div className="story-container">
//             <p className="story-segment">{latestStorySegment}</p>
//           </div>
//           <div className="choice-container">
//             {loading ? (
//               <p>Loading...</p>
//             ) : (
//               choices.map((choice, index) => (
//                 <Button key={index} className="choice-button" onClick={() => handleChoice(choice)}>
//                   {choice.short_description}
//                 </Button>
//               ))
//             )}
//             <Button className="button-game-over" onClick={handleEndGame}>End Game</Button>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Loading state or default
//   return <div>Loading...</div>;
// };

// export default Game;

/////RESULT///////////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import Button from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import './Game.css';

const Game = () => {
  // Local LLM states
  const initialStory = `
    You are Raoul Silva, a former MI6 agent with a personal vendetta against M. The memory of betrayal burns within you as you plan your next move. In your secluded hideout, screens display live feeds of MI6 activities. The stolen hard drive containing NATO agents' information is in your possession, and it's time to set your plan in motion.
  `;

  const initialChoices = [
    {
      short_description: 'Launch a cyber attack on MI6\'s mainframe',
      actual_choice: 'You decide to exploit their network weaknesses.',
      attributes: { strategy: +2, deception: +1 },
    },
    {
      short_description: 'Kidnap a key MI6 agent for leverage',
      actual_choice: 'You aim to gain valuable information.',
      attributes: { cunning: +2, ruthlessness: +1 },
    },
    {
      short_description: 'Plant misinformation to mislead MI6',
      actual_choice: 'You attempt to throw them off your trail.',
      attributes: { deception: +2, strategy: +1 },
    },
  ];

  // Common states
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // States for Local LLM game
  const [story, setStory] = useState(initialStory);
  const [latestStorySegment, setLatestStorySegment] = useState(initialStory);
  const [choices, setChoices] = useState(initialChoices);
  const [choiceHistory, setChoiceHistory] = useState([
    { story: initialStory, choice: 'Initial Story', timeTaken: 0 },
  ]);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
  const [loading, setLoading] = useState(false);

  // Player attributes state for Local LLM
  const [playerAttributes, setPlayerAttributes] = useState({
    cunning: 0,
    ruthlessness: 0,
    deception: 0,
    strategy: 0,
    ambition: 0,
  });

  // Time tracking state for Local LLM
  const [startTime, setStartTime] = useState(null);

  // Assistant API states
  const [threadId, setThreadId] = useState(null);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [userInput, setUserInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [assistantMessageTime, setAssistantMessageTime] = useState(null);

  // Start the timer when choices are presented (Local LLM)
  useEffect(() => {
    if (!loading && !gameOver && selectedOption === 'local') {
      setStartTime(Date.now());
    }
  }, [choices, loading, gameOver, selectedOption]);

  // Start the timer when assistant message is received (Assistant API)
  useEffect(() => {
    if (!gameOver && selectedOption === 'api' && assistantMessage) {
      setAssistantMessageTime(Date.now());
    }
  }, [assistantMessage, gameOver, selectedOption]);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    if (option === 'local') {
      setGameStarted(true);
    } else if (option === 'api') {
      // Start conversation with Assistant API
      startAssistantConversation();
    }
  };

  // Local LLM handlers
  const handleChoice = async (choice) => {
    if (currentBreakpoint >= 9) {
      handleEndGame();
      return;
    }

    // Stop the timer and calculate time taken
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // in seconds

    setLoading(true);

    try {
      const accumulatedChoices = choiceHistory
        .map((entry) => entry.choice)
        .filter((choice) => choice !== 'Initial Story');

      // Update player attributes
      setPlayerAttributes((prevAttributes) => {
        const newAttributes = { ...prevAttributes };
        for (let attr in choice.attributes) {
          newAttributes[attr] += choice.attributes[attr];
        }
        return newAttributes;
      });

      // Send the current story, choice, and choice history to the backend
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story: story,
          choice: choice.actual_choice,
          current_breakpoint: currentBreakpoint,
          choice_history: accumulatedChoices,
        }),
      });

      const data = await response.json();
      const newStory =
        data.new_story ||
        'The story continues, but its details remain shrouded in mystery...';
      const newChoices = data.new_choices || [];

      if (newChoices.length === 0) {
        alert('No new choices were generated. Ending the game.');
        handleEndGame();
        return;
      }

      // Update choices with attributes
      const choicesWithAttributes = newChoices.map((choice) => ({
        short_description: choice.short_description,
        actual_choice: choice.actual_choice,
        attributes: choice.attributes,
      }));

      // Update the story context based on the chosen path
      setStory((prevStory) => `${prevStory}\n\n${newStory}`);
      setLatestStorySegment(newStory);

      // Update choices with the new ones
      setChoices(choicesWithAttributes);

      // Update choice history with the new choice, corresponding story segment, and time taken
      setChoiceHistory((prevHistory) => [
        ...prevHistory,
        { choice: choice.short_description, story: newStory, timeTaken },
      ]);

      setCurrentBreakpoint((prev) => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating the story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEndGame = () => {
    // Generate player profile
    const sortedAttributes = Object.entries(playerAttributes)
      .filter(([attr, score]) => score !== 0)
      .sort((a, b) => b[1] - a[1]);

    // Update choice history to include the profile
    setChoiceHistory((prevHistory) => [
      ...prevHistory,
      { gameplay: story },
      { profile: sortedAttributes },
    ]);

    setGameOver(true);
  };

  // Assistant API handlers
  const startAssistantConversation = async () => {
    try {
      const response = await fetch('http://localhost:5000/start_conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Start' }),
      });
      const data = await response.json();
      setThreadId(data.thread_id);
      setAssistantMessage(data.assistant_message);

      // Record the time when the assistant's message is received
      setAssistantMessageTime(Date.now());

      // Initialize conversation history
      setConversationHistory([
        { role: 'assistant', content: data.assistant_message },
      ]);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const sendMessageToAssistant = async () => {
    if (!userInput.trim()) return;

    // Stop the timer and calculate time taken
    const endTime = Date.now();
    const timeTaken = (endTime - assistantMessageTime) / 1000; // in seconds

    try {
      // Update conversation history with user's message and time taken
      setConversationHistory((prev) => [
        ...prev,
        { role: 'user', content: userInput, timeTaken },
      ]);

      const response = await fetch('http://localhost:5000/send_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId, message: userInput }),
      });
      const data = await response.json();
      setAssistantMessage(data.assistant_message);

      // Record the time when the assistant's message is received
      setAssistantMessageTime(Date.now());

      // Update conversation history with assistant's message
      setConversationHistory((prev) => [
        ...prev,
        { role: 'assistant', content: data.assistant_message },
      ]);

      // Check for game over condition
      if (data.assistant_message.toLowerCase().includes('game over')) {
        handleEndGameAssistant();
      }

      setUserInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleEndGameAssistant = () => {
    setGameOver(true);
  };

  // Render logic
  if (!selectedOption) {
    // Front page with two options
    return (
      <div className="front-screen">
        <div className="front-title-box">
          <h1 className="front-title">Echoes of Choice</h1>
          <Button
            className="start-button"
            onClick={() => handleSelectOption('local')}
          >
            Use Local LLM
          </Button>
          <Button
            className="start-button"
            onClick={() => handleSelectOption('api')}
          >
            Use Assistant API
          </Button>
        </div>
      </div>
    );
  }

  // Assistant API game over screen
  if (selectedOption === 'api' && gameOver) {
    // Calculate average decision time
    const timeTakenList = conversationHistory
      .filter((entry) => entry.role === 'user' && entry.timeTaken !== undefined)
      .map((entry) => entry.timeTaken);

    const totalTime = timeTakenList.reduce((acc, time) => acc + time, 0);
    const averageTime = (totalTime / timeTakenList.length).toFixed(2);

    // Provide feedback based on average decision time
    let decisionSpeedFeedback = '';
    if (averageTime < 5) {
      decisionSpeedFeedback =
        'You made decisions quickly, indicating an impulsive decision-making style.';
    } else if (averageTime < 15) {
      decisionSpeedFeedback =
        'You took a moderate amount of time to make decisions, showing a balanced decision-making approach.';
    } else {
      decisionSpeedFeedback =
        'You took your time with decisions, reflecting a careful and deliberate decision-making style.';
    }

    return (
      <div className="game-over-container">
        <h2>Game Over - Your Story Journey</h2>
        {conversationHistory.map((entry, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            {entry.role === 'user' && (
              <>
                <p>
                  <strong>Your Choice:</strong> {entry.content}
                </p>
                {entry.timeTaken !== undefined && (
                  <p>
                    <strong>Time Taken:</strong> {entry.timeTaken.toFixed(2)} seconds
                  </p>
                )}
              </>
            )}
            {entry.role === 'assistant' && (
              <p>
                <strong>Assistant:</strong> {entry.content}
              </p>
            )}
            {index < conversationHistory.length - 1 && <hr />}
          </div>
        ))}
        <h3>Decision Speed Analysis</h3>
        <p>
          <strong>Average Decision Time:</strong> {averageTime} seconds
        </p>
        <p>{decisionSpeedFeedback}</p>
        <Button onClick={() => window.location.reload()}>Start Over</Button>
      </div>
    );
  }

  // Assistant API interaction page
  if (selectedOption === 'api' && threadId && !gameOver) {
    return (
      <div className="assistant-page">
        <div className="message-container">
          <div className="assistant-message">
            <p>{assistantMessage}</p>
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Your choice..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessageToAssistant()}
            />
            <Button onClick={sendMessageToAssistant}>Send</Button>
          </div>
          {/* End Game Button */}
          <Button className="button-game-over" onClick={handleEndGameAssistant}>
            End Game
          </Button>
        </div>
      </div>
    );
  }

  // Local LLM game over screen
  if (gameOver && selectedOption === 'local') {
    // Calculate average decision time
    const timeTakenList = choiceHistory
      .filter((entry) => entry.timeTaken !== undefined)
      .map((entry) => entry.timeTaken);

    const totalTime = timeTakenList.reduce((acc, time) => acc + time, 0);
    const averageTime = (totalTime / timeTakenList.length).toFixed(2);

    // Provide feedback based on average decision time
    let decisionSpeedFeedback = '';
    if (averageTime < 5) {
      decisionSpeedFeedback =
        'You made decisions quickly, indicating an impulsive decision-making style.';
    } else if (averageTime < 15) {
      decisionSpeedFeedback =
        'You took a moderate amount of time to make decisions, showing a balanced decision-making approach.';
    } else {
      decisionSpeedFeedback =
        'You took your time with decisions, reflecting a careful and deliberate decision-making style.';
    }

    return (
      <div className="game-over-container">
        <h2>Game Over - Your Story Journey</h2>
        {choiceHistory.map((entry, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            {entry.choice !== 'Initial Story' && entry.choice && (
              <>
                <p>
                  <strong>Your Choice:</strong> {entry.choice}
                </p>
                <p>
                  <strong>Time Taken:</strong> {entry.timeTaken.toFixed(2)} seconds
                </p>
              </>
            )}
            {entry.story && (
              <p>
                <strong>Story Segment:</strong> {entry.story}
              </p>
            )}
            {entry.gameplay && (
              <>
                <h3>Your Complete Story:</h3>
                <p>{entry.gameplay}</p>
              </>
            )}
            {entry.profile && (
              <>
                <h3>Your Character Profile:</h3>
                {entry.profile.map(([attr, score]) => (
                  <p key={attr}>
                    {attr.charAt(0).toUpperCase() + attr.slice(1)}: {score}
                  </p>
                ))}
              </>
            )}
            {index < choiceHistory.length - 1 && <hr />}
          </div>
        ))}
        <h3>Decision Speed Analysis</h3>
        <p>
          <strong>Average Decision Time:</strong> {averageTime} seconds
        </p>
        <p>{decisionSpeedFeedback}</p>
        <Button onClick={() => window.location.reload()}>Start Over</Button>
      </div>
    );
  }

  // Local LLM game screen
  if (gameStarted && selectedOption === 'local' && !gameOver) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interactive Story Game</CardTitle>
        </CardHeader>
        <CardContent className="text-container">
          <div className="story-container">
            <p className="story-segment">{latestStorySegment}</p>
          </div>
          <div className="choice-container">
            {loading ? (
              <p>Loading...</p>
            ) : (
              choices.map((choice, index) => (
                <Button
                  key={index}
                  className="choice-button"
                  onClick={() => handleChoice(choice)}
                >
                  {choice.short_description}
                </Button>
              ))
            )}
            {/* End Game Button */}
            <Button className="button-game-over" onClick={handleEndGame}>
              End Game
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state or default
  return <div>Loading...</div>;
};

export default Game;
