import { RuntimeError } from "./runtime_error";
import { Token } from "./token";


export class Environment {
    private readonly values: Map<string, any> = new Map<string, any>();

    public define(name: string, value: any): void {
        this.values.set(name, value);
    }

    public get(name: Token): any {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme);
        }

        throw new RuntimeError(name, `Undefined variable ${name.lexeme}.`)
    }

    public assign(name: Token, value: any) {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value);
            return;
        }

        throw new RuntimeError(name, `Undefined variable ${name.lexeme}.`)
    }
}