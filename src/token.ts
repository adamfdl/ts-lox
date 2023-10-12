import { TokenType } from './token_type';

export class Token {
    readonly type: TokenType;

    readonly lexeme: string;

    readonly literal: string | number | null | boolean;

    readonly line: number;

    constructor(tokenType: TokenType, lexeme: string, literal: string | number | null | boolean | null, line: number) {
        this.type = tokenType;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    public toString(): string {
        return this.type + ' ' + this.lexeme + ' ' + this.literal;
    }
}
