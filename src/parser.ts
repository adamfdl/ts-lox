import { Binary, Expr, Grouping, Literal, Unary } from './expr';
import { Lox } from './lox';
import { Token } from './token';
import { TokenType } from './token_type';

class ParseError extends Error {
    constructor() {
        super();
    }
}

export class Parser {
    private readonly tokens: Token[];
    private current: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public parse(): Expr {
        try {
            return this.expression();
        } catch (error: any) {
            if (error instanceof ParseError) {
                // TODO: This is not finished, we will revisit this later when we
                // add statements into the language
            }
            return null as any;
        }
    }

    /**
     *
     * expression    → equality ;
     */
    private expression(): Expr {
        return this.equality();
    }

    /**
     *
     * equality      → comparison ( ( "!=" | "==" ) comparison )* ;
     */
    private equality(): Expr {
        // The first comparison nonterminal in the body tranlsates to the first call
        // to comparison()
        let expr: Expr = this.comparison();

        // The (...)* loop in the rules maps to a while loop.
        while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            const operator: Token = this.previous();
            const right: Expr = this.comparison();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    /**
     *
     * match checks to see if the current token has any of the given types. If it does,
     * it consumes the token and returns true. Otherwise, it leaves the current token alone
     * and returns false.
     */
    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    /**
     *
     * check returns true if the current token is of the given type. Unlike match()
     * it never consumes the token.
     */
    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type == type;
    }

    /**
     *
     * advance consumes the current token and returns it.
     */
    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    /**
     *
     * isAtEnd returns true if we are out of tokens.
     */
    private isAtEnd(): boolean {
        return this.peek().type == TokenType.EOF;
    }

    /**
     *
     * peek returns the current token we haven't consumed yet.
     */
    private peek(): Token {
        return this.tokens[this.current];
    }

    /**
     *
     * previous returns the most recently consumed token.
     */
    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    /**
     *
     * comparison    → addition ( ( ">" | ">=" | "<" | "<=" ) addition )* ;
     */
    private comparison(): Expr {
        let expr: Expr = this.term();

        while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            const operator: Token = this.previous();
            const right: Expr = this.term();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    /**
     *
     * term         → factor ( ( "-" | "+" ) factor)* ;
     */
    private term(): Expr {
        let expr: Expr = this.factor();

        while (this.match(TokenType.MINUS, TokenType.PLUS)) {
            const operator: Token = this.previous();
            const right: Expr = this.factor();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    /**
     *
     * factor       → unary ( ( "/" | "*" ) unary)* ;
     */
    private factor(): Expr {
        let expr: Expr = this.unary();

        while (this.match(TokenType.SLASH, TokenType.STAR)) {
            const operator: Token = this.previous();
            const right: Expr = this.unary();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    /**
     *
     * unary        → ( "!" | "-" ) unary | primary ;
     */
    private unary(): Expr {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            const operator: Token = this.previous();
            const right: Expr = this.unary();
            return new Unary(operator, right);
        }

        return this.primary();
    }

    /**
     *
     * primary      → NUMBER | STRING | "false" | "true" | "nil" | "(" expression ")" ;
     */
    private primary(): Expr {
        if (this.match(TokenType.FALSE)) return new Literal(false);
        if (this.match(TokenType.TRUE)) return new Literal(true);
        if (this.match(TokenType.NIL)) return new Literal(null);

        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Literal(this.previous().literal);
        }

        if (this.match(TokenType.LEFT_PAREN)) {
            const expr: Expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
            return new Grouping(expr);
        }

        throw new Error(this.peek() + ': Expected expression.');
    }

    /**
     *
     * consume consumes the current token if it is of the expected type (just like match).
     * If not, it reports an error.
     */
    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();

        throw this.error(this.peek(), message);
    }

    /**
     *
     * error reports an error at a given token.
     */
    private error(token: Token, message: string): ParseError {
        Lox.parseError(token, message);
        return new ParseError();
    }

    /**
     *
     * synchronize discards tokens until we are at a statement boundary.
     */
    private synchronize(): void {
        this.advance();

        while (!this.isAtEnd()) {
            if (this.previous().type === TokenType.SEMICOLON) return;

            switch (this.peek().type) {
                case TokenType.CLASS:
                case TokenType.FUN:
                case TokenType.VAR:
                case TokenType.FOR:
                case TokenType.IF:
                case TokenType.WHILE:
                case TokenType.PRINT:
                case TokenType.RETURN:
                    return;
            }

            this.advance();
        }
    }
}
