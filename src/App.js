import React, { useState } from 'react';
import Button from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

const Game = () => {
  const initialStory = "You find yourself at the entrance of a dark cave. What do you do?";
  const initialChoices = [
    { short_description: "Enter the cave", actual_choice: "You enter the cave." },
    { short_description: "Look around", actual_choice: "You look around the cave entrance." },
    { short_description: "Leave", actual_choice: "You decide to leave the cave." }
  ];

  const [story, setStory] = useState(initialStory);
  const [choices, setChoices] = useState(initialChoices);
  const [choiceHistory, setChoiceHistory] = useState([{ story: initialStory, choice: "Initial Story" }]);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false); // To handle loading state

  const handleChoice = async (choice) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story, choice: choice.actual_choice }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const newStory = data.new_story || "The story continues, but the next part is shrouded in mystery...";
      const newChoices = data.new_choices.length > 0 ? data.new_choices : [
        { short_description: "Continue", actual_choice: "You decide to continue." },
        { short_description: "Pause", actual_choice: "You take a moment to pause." },
        { short_description: "End Game", actual_choice: "You choose to end the game." }
      ];

      // Append the new story to the existing story
      setStory(prevStory => `${prevStory}\n\n${newStory}`);

      // Update choices with the new ones
      setChoices(newChoices);

      // Update choice history with the new choice and corresponding story segment
      setChoiceHistory(prevHistory => [
        ...prevHistory,
        { choice: choice.short_description, story: newStory }
      ]);

    } catch (error) {
      console.error('Error:', error);
      // Optionally, display an error message to the user
      alert('An error occurred while generating the story. Please try again.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleEndGame = () => {
    setChoiceHistory(prevHistory => [
      ...prevHistory,
      { story } // Add the final state of the story
    ]);
    setGameOver(true);
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
            <div key={index} style={{ marginBottom: '1rem' }}>
              {entry.choice !== "Initial Story" && entry.choice && (
                <p><strong>Your Choice:</strong> {entry.choice}</p>
              )}
              <p><strong>Story Segment:</strong> {entry.story}</p>
              {index < choiceHistory.length - 1 && <hr />}
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
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {choices.map((choice, index) => (
              <Button key={index} onClick={() => handleChoice(choice)}>
                {choice.short_description}
              </Button>
            ))}
            <Button onClick={handleEndGame}>End Game</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Game;
