import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/lithuanian-flashcards/', // this line is key
  plugins: [react()],
});
