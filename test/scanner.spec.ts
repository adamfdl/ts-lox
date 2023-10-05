import { assert, expect } from 'chai';

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
});
