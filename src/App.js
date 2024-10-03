import React, { useState } from 'react';
import Button from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

const Game = () => {
  const [story, setStory] = useState("You find yourself at the entrance of a dark cave. What do you do?");
  const [choices, setChoices] = useState(["Enter the cave", "Look around", "Leave"]);
  const [gameOver, setGameOver] = useState(false);

  const handleChoice = async (choice) => {
    try {
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
      const newStory = data.new_story;

      setStory(newStory);
      // Update choices based on new story (we need to implement logic to extract new choices)
      setChoices(["Option A", "Option B"]);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  const handleEndGame = () => {
    setGameOver(true);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>{gameOver ? "Game Over" : story}</CardTitle>
      </CardHeader>
      <CardContent>
        {gameOver ? (
          <p>Thank you for playing!</p>
        ) : (
          <>
            {choices.map((choice, index) => (
              <Button key={index} onClick={() => handleChoice(choice)}>
                {choice}
              </Button>
            ))}
            <Button onClick={handleEndGame} className="mt-4">
              End Game
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Game;