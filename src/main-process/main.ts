import { app } from 'electron';
import { appDelegate } from './app-delegate';

process.on('uncaughtException', (error) => {
  appDelegate.preventQuit = true;

  console.error('Uncaught Exception: ', error.toString());

  if (error.stack) {
    console.error(error.stack);
  }
});

app.once('ready', async () => {
  try {
    await appDelegate.run();
    console.log('START! 🤔');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
