import prompt from 'prompt-sync';

import { Scanner } from './scanner';

const ask = prompt();
while (true) {
    const tokens = ask('> ');
    if (tokens === 'exit') break;
    run(tokens);
}

function run(source: string): void {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    for (const token of tokens) {
        console.log(token.toString());
    }
}
