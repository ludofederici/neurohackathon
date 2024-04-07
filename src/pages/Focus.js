import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";

import { notion, useNotion } from "../services/notion";
import { Nav } from "../components/Nav";

export function Focus() {
  const { user } = useNotion();
  const [focus, setFocus] = useState(0);
  const [color, setColor] = useState('');
  const [focusScores, setFocusScores] = useState([]); // Step 1: Initialize state for focus scores list
  const [averageFocusScore, setAverageFocusScore] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const subscription = notion.focus().subscribe((focus) => {
      const focusScore = Math.trunc(focus.probability * 100);
      setFocus(focusScore);

      // Append the new focus score to the focusScores list
      setFocusScores((prevScores) => {
      const newFocusScores = [...prevScores, focusScore];

      // Calculate the average using the new array
      const averageFocusScore = Math.round(newFocusScores.slice(-25).reduce((acc, score) => acc + score, 0) / Math.min(newFocusScores.length, 20));
      setAverageFocusScore(averageFocusScore);
      if (averageFocusScore < 23) {
        alert('Your average focus score over the last 25 entries is below 23%. Consider taking a break or changing tasks.');
      }

      return newFocusScores;
    });

      if (focusScore < 30) {
        setColor('red');
      } else {
        setColor('green');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <main className="main-container">
      {user ? <Nav /> : null}
      <div className="metric-score" style={{ borderColor: color }}>
        &nbsp;{focus}% <div className="metric-word">Focus</div>
      </div>
      <div>Average of last 25 scores: {averageFocusScore}%</div>
    </main>
  );
}
