import { expect } from 'chai';

import { Scanner } from '../src/scanner';

describe('Scanner', () => {
    it('should scan single characters', () => {
        const scanner = new Scanner('(){},.-+;*');
        const tokens = scanner.scanTokens();

        expect(tokens.length).to.equal(11);
        expect(tokens[0].type).to.equal('LEFT_PAREN');
        expect(tokens[1].type).to.equal('RIGHT_PAREN');
        expect(tokens[2].type).to.equal('LEFT_BRACE');
        expect(tokens[3].type).to.equal('RIGHT_BRACE');
        expect(tokens[4].type).to.equal('COMMA');
        expect(tokens[5].type).to.equal('DOT');
        expect(tokens[6].type).to.equal('MINUS');
        expect(tokens[7].type).to.equal('PLUS');
        expect(tokens[8].type).to.equal('SEMICOLON');
        expect(tokens[9].type).to.equal('STAR');
        expect(tokens[10].type).to.equal('EOF');
    });

    describe('operator scanners', () => {
        describe('should scan bang operators', () => {
            it('should scan bang equal', () => {
                const tokens = new Scanner('!=').scanTokens();
                expect(tokens[0].type).to.equal('BANG_EQUAL');
            });
            it('should scan bang', () => {
                const tokens = new Scanner('!').scanTokens();
                expect(tokens[0].type).to.equal('BANG');
            });
        });
        describe('should scan equal operators', () => {
            it('should scan equal', () => {
                const tokens = new Scanner('=').scanTokens();
                expect(tokens[0].type).to.equal('EQUAL');
            });
            it('should scan equal equal', () => {
                const tokens = new Scanner('==').scanTokens();
                expect(tokens[0].type).to.equal('EQUAL_EQUAL');
            });
        });
    });

    describe('comments scanner', () => {
        it('should scan comments', () => {
            const tokens = new Scanner('// this is a comment').scanTokens();
            expect(tokens[0].type).to.equal('EOF');
        });
    });

    describe('number scanner', () => {
        it('should scan numbers', () => {
            const tokens = new Scanner('123').scanTokens();
            expect(tokens[0].type).to.equal('NUMBER');
        });
        it('should scan decimal numbers', () => {
            const tokens = new Scanner('123.1').scanTokens();
            expect(tokens[0].type).to.equal('NUMBER');
        });
    });

    describe('string scanner', () => {
        it('should scan strings', () => {
            const tokens = new Scanner('"hello world"').scanTokens();
            expect(tokens[0].type).to.equal('STRING');
        });
        it('should scan identifiers', () => {
            const tokens = new Scanner('my_var').scanTokens();
            expect(tokens[0].type).to.equal('IDENTIFIER');
        });
        it('should scan reserved words', () => {
            const tokens = new Scanner('and').scanTokens();
            expect(tokens[0].type).to.equal('AND');
        });
    });
});
