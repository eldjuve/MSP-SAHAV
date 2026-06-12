import { render } from 'solid-js/web';
import './index.css';
import { App } from './App';
import { loadAllConfig } from './stores/configStore';

loadAllConfig().catch(console.error);

render(() => <App />, document.getElementById('root')!);
