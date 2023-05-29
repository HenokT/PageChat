# PageChat

A Chrome extension that allows you to access Chat GPT from any webpage as well as ask questions about the page you are on. 

The extension is built using [React](https://react.dev/) with [Vite](https://vitejs.dev/) used as the bundler. It's also using the Vite plugin [
CRXJS](https://crxjs.dev/vite-plugin/) that enables things like *Hot Module Replacement(HMR)* and *static asset imports* for a smooth developer experience.

## Development

You can run the extension in development mode using the following commands:

```bash
npm install 
npm run dev
```

Then, go to `chrome://extensions/` and enable `Developer mode` in the top right corner. Then click `Load unpacked` and select the `dist` folder in the project directory. The extension should now be installed and ready to use.

Changes to the code will be automatically reflected in the extension without having to reload the extension.

To build the extension in production mode, run the following command:

```bash
npm run build
```

Then load the `dist` folder as an unpacked extension as described above.