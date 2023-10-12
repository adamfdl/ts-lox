import { Binary, Expr, Grouping, Literal, Unary, Visitor } from './expr';
import { Lox } from './lox';
import { RuntimeError } from './runtime_error';
import { Token } from './token';
import { TokenType } from './token_type';

export class Interpreter implements Visitor<any> {

    private evaluate(expr: Expr): any {
        return expr.accept(this);
    }

    public visitLiteralExpr(expr: Literal): any {
        return expr.value;
    }

    public visitGroupingExpr(expr: Grouping): any {
        return this.evaluate(expr.expression);
    }

    public visitUnaryExpr(expr: Unary): any {
        // First, we evaluate the operand expression
        const right: any = this.evaluate(expr.right);

        // Then we apply the unary operator to the operand
        switch (expr.operator.type) {
            case TokenType.MINUS:
                // TODO: Check if right is a number
                return -right;
            case TokenType.BANG:
                return !this.isTruthy(right);
        }

        // Unreachable.
        return null;
    }

    public visitBinaryExpr(expr: Binary) {
        const left: any = this.evaluate(expr.left);
        const right: any = this.evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.GREATER:
                this.checkNumberOperands(expr.operator, left, right);
                return left > right;
            case TokenType.GREATER_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return left >= right;
            case TokenType.LESS:
                this.checkNumberOperands(expr.operator, left, right);
                return left < right;
            case TokenType.LESS_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return left <= right;
            case TokenType.MINUS:
                this.checkNumberOperand(expr.operator, right);
                return left - right;
            case TokenType.PLUS:
                if (typeof left === 'number' && typeof right === 'number') {
                    return left + right;
                }
                if (typeof left === 'string' && typeof right === 'string') {
                    return left + right;
                }
                throw new RuntimeError(expr.operator, 'Operands must be two numbers or two strings');
            case TokenType.SLASH:
                this.checkNumberOperands(expr.operator, left, right);
                return left / right;
            case TokenType.STAR:
                this.checkNumberOperands(expr.operator, left, right);
                return left * right;
            case TokenType.BANG_EQUAL:
                return !this.isEqual(left, right);
            case TokenType.EQUAL_EQUAL:
                return this.isEqual(left, right);
        }

        // Unreachable
        return null;
    }

    /**
     *
     * isTruthy follows Ruby's definition of truthiness. `false` and `nil` are falsey
     * everything else is truuthy.
     */
    private isTruthy(object: any): boolean {
        if (object === null) return false;
        if (object === 'boolean') return object;
        return true;
    }

    private isEqual(a: any, b: any): boolean {
        if (a === null && b === null) return true;
        if (a === null) return false;

        return a === b;
    }

    private checkNumberOperand(operator: Token, operand: any): void {
        if (typeof operand === 'number') return;
        throw new RuntimeError(operator, 'Operand must be a number.');
    }

    private checkNumberOperands(operator: Token, left: any, right: any): void {
        if (typeof left === 'number' && typeof right === 'number') return;
        throw new RuntimeError(operator, 'Operands must be numbers');
    }

    private stringify(object: any): string {
        if (object === null) return 'nil';
        
        if (typeof object === 'number') {
            let text: string = object.toString();
            if (text.endsWith('.0')) {
                text = text.substring(0, text.length - 2);
            }
            return text
        }

        return String(object);
    }

    public interpret(expr: Expr): void {
        try {
            const value: any = this.evaluate(expr);
            console.log(this.stringify(value));
        } catch (error) {
            if (error instanceof RuntimeError) {
                Lox.runtimeError(error);
            }
        }
    }
}
