import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";


import { notion, useNotion } from "../services/notion";
import { Nav } from "../components/Nav";

export function Focus() {
  const { user } = useNotion();
  const [focus, setFocus] = useState(0);

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
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <main className="main-container">
      {user ? <Nav /> : null}
      <div className="focus-score">
        &nbsp;{focus}% <div className="focus-word">Focus</div>
      </div>
    </main>
  );
}
