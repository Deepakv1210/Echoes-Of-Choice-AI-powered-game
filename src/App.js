import React, { useState } from 'react';
import Button from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import './Game.css';

const Game = () => {
  const initialStory = "You find yourself at the entrance of a dark cave. What do you do?";
  const initialChoices = [
    { short_description: "Enter the cave", actual_choice: "You enter the cave." },
    { short_description: "Look around", actual_choice: "You look around the cave entrance." },
    { short_description: "Leave", actual_choice: "You decide to leave the cave." }
  ];

  const [story, setStory] = useState(initialStory);
  const [latestStorySegment, setLatestStorySegment] = useState(initialStory); // New state for latest story segment
  const [choices, setChoices] = useState(initialChoices);
  const [choiceHistory, setChoiceHistory] = useState([{ story: initialStory, choice: "Initial Story" }]);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false); // To handle loading state


  const handleChoice = async (choice) => {
    setLoading(true);
  
    try {
      // Step 1: Generate text (story)
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story, choice: choice.actual_choice }),
      });
  
      const data = await response.json();
      const newStory = data.new_story || "The story continues...";
      const newChoices = data.new_choices.length > 0 ? data.new_choices : [
        { short_description: "Continue", actual_choice: "You decide to continue." }
      ];
  
      // Step 2: Generate image based on the new story segment
      const imageResponse = await fetch('http://localhost:5000/generate_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newStory }),
      });
  
      const imageData = await imageResponse.json();
      const imageUrl = `http://localhost:5000/${imageData.image_url}?t=${new Date().getTime()}`; // Add cache-busting query param
  
      // Step 3: Wait for the background image to load
      const img = new Image();
      img.src = imageUrl;
  
      img.onload = () => {
        // Set the new background image
        document.body.style.backgroundImage = `url(${imageUrl})`;
  
        // Step 4: Update the story and choices after the image loads
        setStory(prevStory => `${prevStory}\n\n${newStory}`);
        setLatestStorySegment(newStory);
        setChoices(newChoices);
        setChoiceHistory(prevHistory => [
          ...prevHistory,
          { choice: choice.short_description, story: newStory }
        ]);
        setLoading(false); // End loading
      };
  
      img.onerror = () => {
        console.error('Failed to load background image.');
        alert('An error occurred while loading the background image.');
        setLoading(false); // End loading even if there's an error
      };
  
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating the story or image. Please try again.');
      setLoading(false); // End loading
    }
  };


  const handleEndGame = () => {
    // Clear the background image
    document.body.style.backgroundImage = 'none';
  
    // Update choice history and set game over state
    setChoiceHistory(prevHistory => [
      ...prevHistory,
      { gameplay: story }
    ]);
    setGameOver(true);
  };
  

  if (gameOver) {
    // Display report when the game ends
    return (
      <div className="game-over-container">
        <h2>Game Over - Your Story Journey</h2>
        {choiceHistory.map((entry, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            {entry.choice !== "Initial Story" && entry.choice && (
              <p><strong>Your Choice:</strong> {entry.choice}</p>
            )}
            {entry.story && (
              <p><strong>Story Segment:</strong> {entry.story}</p>
            )}
            {/* Final gameplay/story output */}
            {entry.gameplay && (
              <p><strong>Gameplay:</strong> {entry.gameplay}</p>
            )}
            {index < choiceHistory.length - 1 && <hr />}
          </div>
        ))}
        <Button onClick={() => window.location.reload()}>Start Over</Button>
      </div>
    );
  }

  return (

<Card>
  <div className="title-container">
    Interactive Story Game
  </div>
  <CardContent className="text-container">
    {loading ? (
      <p>Loading...</p>
    ) : (
      <>
        {/* Story Segment Box */}
        <div className="story-container">
          <p className="story-segment">{latestStorySegment}</p>
        </div>

        {/* Choices Container */}
        <div className="choice-container">
          {choices.map((choice, index) => (
            <Button key={index} className="choice-button" onClick={() => handleChoice(choice)}>
              {choice.short_description}
            </Button>
          ))}
          <Button className="button-game-over" onClick={handleEndGame}>End Game</Button>
        </div>
      </>
    )}
  </CardContent>
</Card>
  );
};

export default Game;
