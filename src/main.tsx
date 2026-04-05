import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from './app.tsx';
import './index.css';
import { setUpdateChecker } from './util/update';

const updateSW = registerSW({
	immediate: true,
	onRegisteredSW(_swUrl: string, registration?: ServiceWorkerRegistration) {
		if (!registration) {
			setUpdateChecker(null);
			return;
		}

		setUpdateChecker(() => {
			return registration.update().then(() => Boolean(registration.waiting));
		});

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
