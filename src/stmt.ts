import { Expr } from "./expr";
import { Token } from "./token";


export interface Visitor<T> {
    visitExpressionStmt(stmt: Expression): T;
    visitPrintStmt(stmt: Print): T;
    visitVarStmt(stmt: Var): T;
}

export abstract class Stmt {
    public accept<T>(_: Visitor<T>): any {}
}

export class Expression extends Stmt {
    readonly expression: Expr;

    constructor(expression: Expr) {
        super();
        this.expression = expression;
    }

    public accept<T>(visitor: Visitor<T>) {
        return visitor.visitExpressionStmt(this);
    }
}

export class Print extends Stmt {
    readonly expression: Expr;

    constructor(expression: Expr) {
        super();
        this.expression = expression;
    }

    public accept<T>(visitor: Visitor<T>) {
        return visitor.visitPrintStmt(this);    
    }
}

export class Var extends Stmt {
    readonly name: Token;
    readonly initializer: Expr; // This is the initial vale of the variable

    constructor(name: Token, initializer: Expr) {
        super();
        this.name = name;
        this.initializer = initializer;
    }

    public accept<T>(visitor: Visitor<T>) {
        return visitor.visitVarStmt(this);
    }
}