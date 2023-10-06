import { Binary, Expr, Grouping, Literal, Unary, Visitor } from '../expr';

export class AstPrinter implements Visitor<string> {
    public print(expr: Expr): string {
        const data = expr.accept(this);
        return data;
    }

    public visitBinaryExpr(expr: Binary): string {
        return this.paranthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    public visitGroupingExpr(expr: Grouping): string {
        return this.paranthesize('group', expr.expression);
    }

    public visitLiteralExpr(expr: Literal): string {
        if (expr.value === null) return 'nil';
        return expr.value.toString();
    }

    public visitUnaryExpr(expr: Unary): string {
        return this.paranthesize(expr.operator.lexeme, expr.right);
    }

    private paranthesize(name: string, ...exprs: Expr[]): string {
        let s = '';

        s += `(${name}`;

        exprs.forEach((expr) => {
            s += ` ${expr.accept(this)}`;
        });

        s += `)`;

        return s;
    }
}
