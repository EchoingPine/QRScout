import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from './app.tsx';
import './index.css';

const updateSW = registerSW({
	immediate: true,
	onRegisteredSW(_swUrl: string, registration?: ServiceWorkerRegistration) {
		if (!registration) {
			return;
		}

		window.setInterval(() => {
			registration.update();
		}, 60 * 60 * 1000);
	},
	onNeedRefresh() {
		updateSW(true);
	},
});

if ('serviceWorker' in navigator) {
	let reloading = false;
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		if (reloading) {
			return;
		}

		reloading = true;
		window.location.reload();
	});
}

const root = createRoot(document.getElementById('app')!);

root.render(<App />);
