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
            case '!':
                this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG, null);
                break;
            case '=':
                this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL, null);
                break;
            case '<':
                this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS, null);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER, null);
                break;
            // Longer lexemes
            case '/':
                // This is similar to the other two-character operators, except that when we 
                // find a second /, we don't end the token yet. Instead, we keep consuming
                // characters until we reach the end of the line.
                //
                // Comments are lexemes that the scanner ignores. They are not tokens, so we 
                // don't add them to the list of tokens. We just consume characters until we
                // reach the end of the line.
                if (this.match('/')) {
                    while (this.peek() != '\n' && !this.isAtEnd()) this.advance();
                } else {
                    this.addToken(TokenType.SLASH, null);
                }
                break;
            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace.
                break;
            case '\n':
                this.line++;
                break;
            case '"':
                this.string();
                break;
            default:
                if (this.isDigit(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
                    this.identifier();
                } else {
                    console.error(`Unexpected character [${c}] at line ${this.line}`);
                }
                break;
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

    private match(expected: string): boolean {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) !== expected) return false;

        this.current++;
        return true;
    }

    // peek is sort of like advance but doesn't consume the character. This is called
    // lookahead.
    private peek(): string {
        if (this.isAtEnd()) return '\0';
        return this.source.charAt(this.current);
    }

    private peekNext(): string {
        if (this.current + 1 >= this.source.length) return '\0';
        return this.source.charAt(this.current + 1);
    }

    private string(): void {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n') this.line++;
            this.advance();
        }

        if (this.isAtEnd()) {
            // TODO: Format this error with line number also
            console.error("Unterminated string.")
            return
        }

        // The closing ".
        this.advance();

        // Trim the surrounding quotes.
        const value: string = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, value);
    }

    private isDigit(character: string): boolean {
        return character >= '0' && character <= '9';
    }

    private number(): void {
        while (this.isDigit(this.peek())) this.advance();

        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            this.advance();

            while (this.isDigit(this.peek())) this.advance();
        }

        this.addToken(
            TokenType.NUMBER,
            parseFloat(this.source.substring(this.start, this.current))
        )
    }

    private identifier(): void {
        while (this.isAlphaNumeric(this.peek())) this.advance();

        // See if the identifier is a reserved word.
        const text: string = this.source.substring(this.start, this.current);

        const keyword: TokenType | undefined = this.keywords.get(text);
        if (keyword !== undefined) {
            this.addToken(keyword, null);
            return;
        }

        this.addToken(TokenType.IDENTIFIER, null);
    }

    private isAlpha(character: string): boolean {
        return (character >= 'a' && character <= 'z') ||
            (character >= 'A' && character <= 'Z') ||
            character === '_';
    }

    private isAlphaNumeric(character: string): boolean {
        return this.isAlpha(character) || this.isDigit(character);
    }
}
