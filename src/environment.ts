import { RuntimeError } from "./runtime_error";
import { Token } from "./token";


export class Environment {

    private readonly enclosing: Environment | null = null;

    private readonly values: Map<string, any> = new Map<string, any>();

    constructor(enclosing?: Environment) {
        this.enclosing = enclosing || null;
    }

    public define(name: string, value: any): void {
        this.values.set(name, value);
    }

    public get(name: Token): any {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme);
        }

        if (this.enclosing !== null) {
            // This will recursively call get() from this class until it finds the variable
            // if not found, it will throw an error
            return this.enclosing.get(name);
        }

        throw new RuntimeError(name, `Undefined variable ${name.lexeme}.`)
    }

    public assign(name: Token, value: any) {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value);
            return;
        }

        if (this.enclosing !== null) {
            this.enclosing.assign(name, value);
            return;
        }

        throw new RuntimeError(name, `Undefined variable ${name.lexeme}.`)
    }
}