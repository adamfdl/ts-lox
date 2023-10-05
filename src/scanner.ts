import { Token } from './token';
import { TokenType } from './token_type';

export class Scanner {
    readonly source: string;

    readonly tokens: Token[] = new Array<Token>();

    private start: number = 0;

    private current: number = 0;

    private line: number = 1;

    readonly keywords: Map<string, TokenType>;

    constructor(source: string) {
        this.source = source;
        this.keywords = new Map<string, TokenType>();
        this.keywords.set('and', TokenType.AND);
        this.keywords.set('class', TokenType.CLASS);
        this.keywords.set('else', TokenType.ELSE);
        this.keywords.set('false', TokenType.FALSE);
        this.keywords.set('for', TokenType.FOR);
        this.keywords.set('fun', TokenType.FUN);
        this.keywords.set('if', TokenType.IF);
        this.keywords.set('nil', TokenType.NIL);
        this.keywords.set('or', TokenType.OR);
        this.keywords.set('print', TokenType.PRINT);
        this.keywords.set('return', TokenType.RETURN);

        this.keywords.set('super', TokenType.SUPER);
        this.keywords.set('this', TokenType.THIS);
        this.keywords.set('true', TokenType.TRUE);
        this.keywords.set('var', TokenType.VAR);
        this.keywords.set('while', TokenType.WHILE);
    }

    public scanTokens(): Token[] {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, '', {}, this.line));
        return this.tokens;
    }

    private scanToken(): void {
        const c: string = this.advance();
        switch (c) {
            case '(':
                this.addToken(TokenType.LEFT_PAREN, null);
                break;
            case ')':
                this.addToken(TokenType.RIGHT_PAREN, null);
                break;
            case '{':
                this.addToken(TokenType.LEFT_BRACE, null);
                break;
            case '}':
                this.addToken(TokenType.RIGHT_BRACE, null);
                break;
            case ',':
                this.addToken(TokenType.COMMA, null);
                break;
            case '.':
                this.addToken(TokenType.DOT, null);
                break;
            case '-':
                this.addToken(TokenType.MINUS, null);
                break;
            case '+':
                this.addToken(TokenType.PLUS, null);
                break;
            case ';':
                this.addToken(TokenType.SEMICOLON, null);
                break;
            case '*':
                this.addToken(TokenType.STAR, null);
                break;
            default:
                console.error(`Unexpected character ${c} at line ${this.line}`);
        }
    }

    private isAtEnd(): boolean {
        return this.current >= this.source.length;
    }

    private advance(): string {
        return this.source.charAt(this.current++);
    }

    private addToken(type: TokenType, literal: Object | null): void {
        const text: string = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }
}
