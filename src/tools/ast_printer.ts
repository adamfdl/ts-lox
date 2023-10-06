import { Binary, Expr, Grouping, Literal, Unary, Visitor } from "../expr";
import { Token } from "../token";
import { TokenType } from "../token_type";


class AstPrinter implements Visitor<string> {

    public print(expr: Expr): string {
        const data = expr.accept(this);
        return data
    }

    public visitBinaryExpr(expr: Binary): string {
        return this.paranthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    public visitGroupingExpr(expr: Grouping): string {
        return this.paranthesize("group", expr.expression);
    }

    public visitLiteralExpr(expr: Literal): string {
        if (expr.value === null) return "nil"
        return expr.value.toString();
    }

    public visitUnaryExpr(expr: Unary): string {
        return this.paranthesize(expr.operator.lexeme, expr.right);
    }

    private paranthesize(name: string, ...exprs: Expr[]): string {
        let s = "";

        s += `(${name}`;

        exprs.forEach(expr => {
            s += ` ${expr.accept(this)}`;
        });

        s += `)`;

        return s;
    }
}


const expression1 = new Binary(
    new Unary(
        new Token(TokenType.MINUS, '-', null, 1),
        new Literal(123)
    ),
    new Token(TokenType.STAR, '*', null, 1),
    new Grouping(
        new Literal(45.67)
    )
)

const expression2 = new Unary(
    new Token(TokenType.MINUS, '-', null, 1),
    new Literal(123),
)


const expression3 = new Literal(123)

const astPrinter = new AstPrinter();
// const ast = astPrinter.print(expression3)
const ast = astPrinter.print(expression2)
console.log(ast)