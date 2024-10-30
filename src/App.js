// import React, { useState } from 'react';
// import Button from './components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
// import './Game.css';

// const Game = () => {
//   const initialStory = "You find yourself at the entrance of a dark cave. What do you do?";
//   const initialChoices = [
//     { short_description: "Enter the cave", actual_choice: "You enter the cave." },
//     { short_description: "Look around", actual_choice: "You look around the cave entrance." },
//     { short_description: "Leave", actual_choice: "You decide to leave the cave." }
//   ];

//   const [story, setStory] = useState(initialStory);
//   const [latestStorySegment, setLatestStorySegment] = useState(initialStory); // New state for latest story segment
//   const [choices, setChoices] = useState(initialChoices);
//   const [choiceHistory, setChoiceHistory] = useState([{ story: initialStory, choice: "Initial Story" }]);
//   const [gameOver, setGameOver] = useState(false);
//   const [loading, setLoading] = useState(false); // To handle loading state


//   const handleChoice = async (choice) => {
//     setLoading(true);
  
//     try {
//       // Step 1: Generate text (story)
//       const response = await fetch('http://localhost:5000/generate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ story, choice: choice.actual_choice }),
//       });
  
//       const data = await response.json();
//       const newStory = data.new_story || "The story continues...";
//       const newChoices = data.new_choices.length > 0 ? data.new_choices : [
//         { short_description: "Continue", actual_choice: "You decide to continue." }
//       ];
  
//       // Step 2: Generate image based on the new story segment
//       const imageResponse = await fetch('http://localhost:5000/generate_image', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text: newStory }),
//       });
  
//       const imageData = await imageResponse.json();
//       const imageUrl = `http://localhost:5000/${imageData.image_url}?t=${new Date().getTime()}`; // Add cache-busting query param
  
//       // Step 3: Wait for the background image to load
//       const img = new Image();
//       img.src = imageUrl;
  
//       img.onload = () => {
//         // Set the new background image
//         document.body.style.backgroundImage = `url(${imageUrl})`;
  
//         // Step 4: Update the story and choices after the image loads
//         setStory(prevStory => `${prevStory}\n\n${newStory}`);
//         setLatestStorySegment(newStory);
//         setChoices(newChoices);
//         setChoiceHistory(prevHistory => [
//           ...prevHistory,
//           { choice: choice.short_description, story: newStory }
//         ]);
//         setLoading(false); // End loading
//       };
  
//       img.onerror = () => {
//         console.error('Failed to load background image.');
//         alert('An error occurred while loading the background image.');
//         setLoading(false); // End loading even if there's an error
//       };
  
//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred while generating the story or image. Please try again.');
//       setLoading(false); // End loading
//     }
//   };


//   const handleEndGame = () => {
//     // Clear the background image
//     document.body.style.backgroundImage = 'none';
  
//     // Update choice history and set game over state
//     setChoiceHistory(prevHistory => [
//       ...prevHistory,
//       { gameplay: story }
//     ]);
//     setGameOver(true);
//   };
  

//   if (gameOver) {
//     // Display report when the game ends
//     return (
//       <div className="game-over-container">
//         <h2>Game Over - Your Story Journey</h2>
//         {choiceHistory.map((entry, index) => (
//           <div key={index} style={{ marginBottom: '1rem' }}>
//             {entry.choice !== "Initial Story" && entry.choice && (
//               <p><strong>Your Choice:</strong> {entry.choice}</p>
//             )}
//             {entry.story && (
//               <p><strong>Story Segment:</strong> {entry.story}</p>
//             )}
//             {/* Final gameplay/story output */}
//             {entry.gameplay && (
//               <p><strong>Gameplay:</strong> {entry.gameplay}</p>
//             )}
//             {index < choiceHistory.length - 1 && <hr />}
//           </div>
//         ))}
//         <Button onClick={() => window.location.reload()}>Start Over</Button>
//       </div>
//     );
//   }

//   return (

// <Card>
//   <div className="title-container">
//     Interactive Story Game
//   </div>
//   <CardContent className="text-container">
//     {loading ? (
//       <p>Loading...</p>
//     ) : (
//       <>
//         {/* Story Segment Box */}
//         <div className="story-container">
//           <p className="story-segment">{latestStorySegment}</p>
//         </div>

//         {/* Choices Container */}
//         <div className="choice-container">
//           {choices.map((choice, index) => (
//             <Button key={index} className="choice-button" onClick={() => handleChoice(choice)}>
//               {choice.short_description}
//             </Button>
//           ))}
//           <Button className="button-game-over" onClick={handleEndGame}>End Game</Button>
//         </div>
//       </>
//     )}
//   </CardContent>
// </Card>
//   );
// };

// export default Game;

// ----------------------------------------

// import React, { useState } from 'react';
// import Button from './components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
// import './Game.css';

// const Game = () => {
//   const initialStory = `
//     You wake up in a dark, dense forest, your memory clouded. The ground is damp beneath you, and a faint mist lingers in the air.
//     A mysterious compass in your hand points wildly, urging you to follow. You hear a low hum deeper in the forest.
//   `;
//   const initialChoices = [
//     { short_description: "Follow the compass", actual_choice: "You decide to trust the compass." },
//     { short_description: "Explore the surroundings", actual_choice: "You look around the dense forest for clues." },
//     { short_description: "Stay still and listen", actual_choice: "You stay still, listening closely to the hum." }
//   ];

//   const [story, setStory] = useState(initialStory);
//   const [latestStorySegment, setLatestStorySegment] = useState(initialStory);
//   const [choices, setChoices] = useState(initialChoices);
//   const [choiceHistory, setChoiceHistory] = useState([{ story: initialStory, choice: "Initial Story" }]);
//   const [gameOver, setGameOver] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
//   const [deviationCount, setDeviationCount] = useState(0); // New state to track deviation

// import React, { useState, useEffect } from 'react';
// import Button from './components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
// import './Game.css';

// const Game = () => {
//   const initialStory = `
//     You wake up in a dark, dense forest, your memory clouded. The ground is damp beneath you, and a faint mist lingers in the air.
//     A mysterious compass in your hand points wildly, urging you to follow. You hear a low hum deeper in the forest.
//   `;
//   const initialChoices = [
//     { 
//       short_description: "Follow the compass", 
//       actual_choice: "You decide to trust the compass.", 
//       attributes: { curiosity: +2, bravery: +1 } 
//     },
//     { 
//       short_description: "Explore the surroundings", 
//       actual_choice: "You look around the dense forest for clues.", 
//       attributes: { wisdom: +2, caution: +1 } 
//     },
//     { 
//       short_description: "Stay still and listen", 
//       actual_choice: "You stay still, listening closely to the hum.", 
//       attributes: { caution: +2, curiosity: +1 } 
//     }
//   ];

//   const [story, setStory] = useState(initialStory);
//   const [latestStorySegment, setLatestStorySegment] = useState(initialStory);
//   const [choices, setChoices] = useState(initialChoices);
//   const [choiceHistory, setChoiceHistory] = useState([{ story: initialStory, choice: "Initial Story", timeTaken: 0 }]);
//   const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Player attributes state
//   const [playerAttributes, setPlayerAttributes] = useState({
//     bravery: 0,
//     wisdom: 0,
//     compassion: 0,
//     curiosity: 0,
//     caution: 0,
//     resourcefulness: 0,
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


//---------------------BG Image-------------------

import React, { useState, useEffect } from 'react';
import Button from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import './Game.css';

const Game = () => {
  const initialStory = `
    You wake up in a dark, dense forest, your memory clouded. The ground is damp beneath you, and a faint mist lingers in the air.
    A mysterious compass in your hand points wildly, urging you to follow. You hear a low hum deeper in the forest.
  `;
  const initialChoices = [
    { 
      short_description: "Follow the compass", 
      actual_choice: "You decide to trust the compass.", 
      attributes: { curiosity: +2, bravery: +1 } 
    },
    { 
      short_description: "Explore the surroundings", 
      actual_choice: "You look around the dense forest for clues.", 
      attributes: { wisdom: +2, caution: +1 } 
    },
    { 
      short_description: "Stay still and listen", 
      actual_choice: "You stay still, listening closely to the hum.", 
      attributes: { caution: +2, curiosity: +1 } 
    }
  ];

  const [story, setStory] = useState(initialStory);
  const [latestStorySegment, setLatestStorySegment] = useState(initialStory);
  const [choices, setChoices] = useState(initialChoices);
  const [choiceHistory, setChoiceHistory] = useState([{ story: initialStory, choice: "Initial Story", timeTaken: 0 }]);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Player attributes state
  const [playerAttributes, setPlayerAttributes] = useState({
    bravery: 0,
    wisdom: 0,
    curiosity: 0,
    caution: 0,
    resourcefulness: 0,
  });

  // Time tracking state
  const [startTime, setStartTime] = useState(null);

  // Start the timer when choices are presented
  useEffect(() => {
    if (!loading && !gameOver) {
      setStartTime(Date.now());
    }
  }, [choices, loading, gameOver]);

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
      const accumulatedChoices = choiceHistory.map(entry => entry.choice).filter(choice => choice !== "Initial Story");

      // Update player attributes
      setPlayerAttributes(prevAttributes => {
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
          choice_history: accumulatedChoices
        }),
      });

      const data = await response.json();
      const newStory = data.new_story || "The story continues, but its details remain shrouded in mystery...";
      const newChoices = data.new_choices || [];

      if (newChoices.length === 0) {
        alert("No new choices were generated. Ending the game.");
        handleEndGame();
        return;
      }

      // Update choices with attributes
      const choicesWithAttributes = newChoices.map(choice => ({
        short_description: choice.short_description,
        actual_choice: choice.actual_choice,
        attributes: choice.attributes
      }));

      // Update the story context based on the chosen path
      setStory(prevStory => `${prevStory}\n\n${newStory}`);
      setLatestStorySegment(newStory);

      // Update choices with the new ones
      setChoices(choicesWithAttributes);

      // Update choice history with the new choice, corresponding story segment, and time taken
      setChoiceHistory(prevHistory => [
        ...prevHistory,
        { choice: choice.short_description, story: newStory, timeTaken }
      ]);

      setCurrentBreakpoint(prev => prev + 1);

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
    setChoiceHistory(prevHistory => [
      ...prevHistory,
      { gameplay: story },
      { profile: sortedAttributes }
    ]);

    setGameOver(true);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="front-screen">
        <div className="front-title-box">
          <h1 className="front-title">Interactive Story Game</h1>
          <p className="front-description">
            Welcome to the Labyrinth of Reflections. Prepare yourself for a journey filled with choices, courage, and mysteries.
          </p>
          <Button className="start-button" onClick={handleStartGame}>
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    // Calculate average decision time
    const timeTakenList = choiceHistory
      .filter(entry => entry.timeTaken !== undefined)
      .map(entry => entry.timeTaken);

    const totalTime = timeTakenList.reduce((acc, time) => acc + time, 0);
    const averageTime = (totalTime / timeTakenList.length).toFixed(2);

    // Provide feedback based on average decision time
    let decisionSpeedFeedback = '';
    if (averageTime < 5) {
      decisionSpeedFeedback = 'You made decisions quickly, indicating an impulsive decision-making style.';
    } else if (averageTime < 15) {
      decisionSpeedFeedback = 'You took a moderate amount of time to make decisions, showing a balanced decision-making approach.';
    } else {
      decisionSpeedFeedback = 'You took your time with decisions, reflecting a careful and deliberate decision-making style.';
    }

    return (
      <div className="game-over-container">
        <h2>Game Over - Your Story Journey</h2>
        {choiceHistory.map((entry, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            {entry.choice !== "Initial Story" && entry.choice && (
              <>
                <p><strong>Your Choice:</strong> {entry.choice}</p>
                <p><strong>Time Taken:</strong> {entry.timeTaken.toFixed(2)} seconds</p>
              </>
            )}
            {entry.story && (
              <p><strong>Story Segment:</strong> {entry.story}</p>
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
                  <p key={attr}>{attr.charAt(0).toUpperCase() + attr.slice(1)}: {score}</p>
                ))}
              </>
            )}
            {index < choiceHistory.length - 1 && <hr />}
          </div>
        ))}
        <h3>Decision Speed Analysis</h3>
        <p><strong>Average Decision Time:</strong> {averageTime} seconds</p>
        <p>{decisionSpeedFeedback}</p>
        <Button onClick={() => window.location.reload()}>Start Over</Button>
      </div>
    );
  }

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
              <Button key={index} className="choice-button" onClick={() => handleChoice(choice)}>
                {choice.short_description}
              </Button>
            ))
          )}
          <Button className="button-game-over" onClick={handleEndGame}>End Game</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Game;

