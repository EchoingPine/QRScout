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
		}, 2 * 60 * 1000);
	},
	onNeedRefresh() {
		const shouldUpdate = window.confirm(
			'A new version of QR Scout is available. Update now?',
		);

		if (shouldUpdate) {
			updateSW(true);
		}
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
