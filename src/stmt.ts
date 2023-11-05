import { Expr } from "./expr";
import { Token } from "./token";


export interface Visitor<T> {
    visitExpressionStmt(stmt: Expression): T;
    visitPrintStmt(stmt: Print): T;
    visitVarStmt(stmt: Var): T;
    visitBlockStmt(stmt: Block): T;
    visitIfStmt(stmt: If): T;
    visitWhileStmt(stmt: While): T;
}

export abstract class Stmt {
    public accept<T>(_: Visitor<T>): any {}
}

export class Block extends Stmt {
    readonly statements: Stmt[];

    constructor(statements: Stmt[]) {
        super();
        this.statements = statements;
    }

    public accept<T>(visitor: Visitor<T>) {
        return visitor.visitBlockStmt(this);
    }
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

export class If extends Stmt {
    readonly condition: Expr;
    readonly thenBranch: Stmt;
    readonly elseBranch: Stmt | null;

    constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
        super();
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    public accept<T>(visitor: Visitor<T>) {
        return visitor.visitIfStmt(this);
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

export class While extends Stmt {
    // Here you can see why it's nice to separate base classes for expressions and statements.
    // The field declaration makes it clear that the condition is an expression and the body is a statement.

    readonly condition: Expr;
    readonly body: Stmt;

    constructor(condition: Expr, body: Stmt) {
        super();
        this.condition = condition;
        this.body = body;
    }

    public accept<T>(visitor: Visitor<T>) {
        return visitor.visitWhileStmt(this);
    }
}