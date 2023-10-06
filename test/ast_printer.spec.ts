import { expect } from 'chai';

import { Binary, Grouping, Literal, Unary } from '../src/expr';
import { AstPrinter } from '../src/tools/ast_printer';
import { Token } from '../src/token';
import { TokenType } from '../src/token_type';

describe('AST Printer', () => {
    it('prints literals', () => {
        const astPrinter = new AstPrinter();

        const expression = new Literal(123);
        const ast = astPrinter.print(expression);
        expect(ast).to.equal('123');
    });

    it('prints unary expressions', () => {
        const astPrinter = new AstPrinter();

        const expression = new Unary(new Token(TokenType.MINUS, '-', null, 1), new Literal(123));
        const ast = astPrinter.print(expression);
        expect(ast).to.equal('(- 123)');
    });

    it('prints binary expressions', () => {
        const astPrinter = new AstPrinter();

        const expression = new Binary(
            new Unary(new Token(TokenType.MINUS, '-', null, 1), new Literal(123)),
            new Token(TokenType.STAR, '*', null, 1),
            new Grouping(new Literal(45.67))
        );
        const ast = astPrinter.print(expression);
        expect(ast).to.equal('(* (- 123) (group 45.67))');
    });
});
