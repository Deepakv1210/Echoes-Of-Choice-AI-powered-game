import React, { useState } from 'react';
import Button from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

const Game = () => {
  const initialStory = "You find yourself at the entrance of a dark cave. What do you do?";
  const initialChoices = ["Enter the cave", "Look around", "Leave"];

  const [story, setStory] = useState(initialStory);  // Current story
  const [choices, setChoices] = useState(initialChoices);  // Available choices
  const [gameOver, setGameOver] = useState(false);
  const [choiceHistory, setChoiceHistory] = useState([{ story: initialStory, choice: null }]);  // Track story and choices

  const handleChoice = async (choice) => {
    try {
      // Send the current story and choice to the backend
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story, choice }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const newStory = data.new_story;  // Get the new story segment
      const newChoices = data.new_choices;  // Get the new set of choices

      // Append the new story to the existing story
      setStory(prevStory => `${prevStory}\n\n${newStory}`);

      // Update choices with the new ones
      setChoices(newChoices);

      // Update choice history with the new choice and corresponding story segment
      setChoiceHistory(prevHistory => [...prevHistory, { story: newStory, choice }]);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEndGame = () => {
    setGameOver(true);  // End the game

    // Log choice history for the report
    console.log("Choice History:", choiceHistory);
  };

  if (gameOver) {
    // Display report when the game ends
    return (
      <Card>
        <CardHeader>
          <CardTitle>Game Over - Your Story Journey</CardTitle>
        </CardHeader>
        <CardContent>
          {choiceHistory.map((entry, index) => (
            <div key={index}>
              {entry.choice && <p><strong>Your Choice:</strong> {entry.choice}</p>}
              <p><strong>Story Segment:</strong> {entry.story}</p>
              <hr />
            </div>
          ))}
          <Button onClick={() => window.location.reload()}>Start Over</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Story Game</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{story}</p>
        {choices.map((choice, index) => (
          <Button key={index} onClick={() => handleChoice(choice)}>
            {choice}
          </Button>
        ))}
        <Button onClick={handleEndGame}>End Game</Button>
      </CardContent>
    </Card>
  );
};

export default Game;
