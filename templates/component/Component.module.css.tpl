.root {
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 8px 12px;
  border: 0;
  background: var(--arcade-panel);
  color: var(--arcade-white);
  font-family: var(--arcade-font-display);
  font-size: 10px;
  line-height: 1.5;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  image-rendering: pixelated;
  -webkit-font-smoothing: none;
  font-smooth: never;
  transform: translateY(0);
  transition: transform 40ms steps(1, end), box-shadow 40ms steps(1, end);
  box-shadow: var(--arcade-pixel-border), var(--arcade-drop-shadow);
}

.root:active {
  transform: translateY(4px);
  box-shadow: var(--arcade-pixel-border);
}
