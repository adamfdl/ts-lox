import { Token } from './token';

// TODO: We can unexport this interface?
export interface Visitor<T> {
    visitBinaryExpr(expr: Binary): T;
    visitGroupingExpr(expr: Grouping): T;
    visitLiteralExpr(expr: Literal): T;
    visitUnaryExpr(expr: Unary): T;
    visitVariableExpr(expr: Variable): T;
    visitAssignExpr(expr: Assign): T;
    visitLogicalExpr(expr: Logical): T;
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
    readonly value: number | string | boolean | null;

    constructor(value: number | string | boolean | null) {
        super();
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): any {
        return visitor.visitLiteralExpr(this);
    }
}

export class Logical extends Expr {
    readonly left: Expr;
    readonly operator: Token;
    readonly right: Expr;

    constructor(left: Expr, operator: Token, right: Expr) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: Visitor<T>) {
        return visitor.visitLogicalExpr(this);
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

export class Variable extends Expr {
    readonly name: Token;

    constructor(name: Token) {
        super();
        this.name = name;
    }

    accept<T>(visitor: Visitor<T>): any {
        return visitor.visitVariableExpr(this);
    }
}

export class Assign extends Expr {
    readonly name: Token;
    readonly value: Expr;

    constructor(name: Token, value: Expr) {
        super();
        this.name = name;
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>): any {
        return visitor.visitAssignExpr(this);
    }
}