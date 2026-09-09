import {spawn} from 'node:child_process';
import process from 'node:process';
import puppeteer from 'puppeteer';

const executablePath = await puppeteer.executablePath();
const stencilCommand = process.platform === 'win32' ? 'stencil.cmd' : 'stencil';
const child = spawn(stencilCommand, ['test', '--e2e', ...process.argv.slice(2)], {
  env: {...process.env, PUPPETEER_EXECUTABLE_PATH: executablePath},
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

const signals = ['SIGINT', 'SIGTERM', 'SIGHUP'];
for (const signal of signals) {
  process.on(signal, () => child.kill(signal));
}

child.on('error', error => {
  console.error(error);
  process.exitCode = 1;
});

child.on('exit', (code, signal) => {
  if (signal) {
    for (const forwardedSignal of signals) {
      process.removeAllListeners(forwardedSignal);
    }
    process.kill(process.pid, signal);
  } else {
    process.exitCode = code ?? 1;
  }
});
