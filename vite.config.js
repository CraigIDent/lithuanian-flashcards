import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/deutsche-flashcards/', // this line is key
  plugins: [react()],
});
