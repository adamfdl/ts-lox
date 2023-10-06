import { Token } from './token';

// TODO: We can unexport this interface?
export interface Visitor<T> {
    visitBinaryExpr(expr: Binary): T;
    visitGroupingExpr(expr: Grouping): T;
    visitLiteralExpr(expr: Literal): T;
    visitUnaryExpr(expr: Unary): T;
}

// TODO: Learn what is abstract class
export abstract class Expr {
    // TODO: Learn what is generics
    public accept<T>(_: Visitor<T>): any {}
}

export class Binary extends Expr {
    readonly left: Expr;
    readonly operator: Token;
    readonly right: Expr;

    constructor(left: Expr, operator: Token, right: Expr) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: Visitor<T>): any {
        return visitor.visitBinaryExpr(this);
    }
}

export class Grouping extends Expr {
    readonly expression: Expr;

    constructor(expression: Expr) {
        super();
        this.expression = expression;
    }

    accept<T>(visitor: Visitor<T>): any {
        return visitor.visitGroupingExpr(this);
    }
}

export class Literal extends Expr {
    // value could be of type number, string, boolean or null
    // we could also have it as a union type of number | string | boolean | null
    readonly value: Object;

    constructor(value: Object) {
        super();
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): any {
        return visitor.visitLiteralExpr(this);
    }
}

export class Unary extends Expr {
    readonly operator: Token;
    readonly right: Expr;

    constructor(operator: Token, right: Expr) {
        super();
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: Visitor<T>): any {
        return visitor.visitUnaryExpr(this);
    }
}
