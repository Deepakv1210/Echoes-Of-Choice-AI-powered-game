import React, { useState } from 'react';
import Button from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

const Game = () => {
  const initialStory = "You find yourself at the entrance of a dark cave. What do you do?";
  const initialChoices = ["Enter the cave", "Look around", "Leave"];

  const [story, setStory] = useState(initialStory);
  const [choices, setChoices] = useState(initialChoices);
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
      const newChoices = data.new_choices;

      setStory(newStory);
      setChoices(newChoices);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEndGame = () => {
    setStory(initialStory);
    setChoices(initialChoices);
    setGameOver(true);
  };

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