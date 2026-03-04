import { render } from 'preact';

import preactLogo from './assets/preact.svg';
import './style.css';
import UI from './ui';


export function App() {
	return (
		<div class="container">
			<UI/>

		</div>
	);
}



render(<App />, document.getElementById('app'));
