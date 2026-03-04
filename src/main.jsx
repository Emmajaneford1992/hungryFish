import { h, render } from 'preact';
import './style.css';
import UI from './ui.jsx'; // make sure this is your UI component

// Optional App wrapper if you want to keep the <App /> container
export function App() {
  return (
    <div className="container">
      <UI />
    </div>
  );
}

render(<App />, document.getElementById('app'));