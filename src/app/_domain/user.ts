export class User { // FIXME: isto era meu, verifica se queres/precisas
  constructor(
    private _id: number,
    private _email: string,
    private _name: string,
    private _avatar: string,
    private _joiningTimestamp: number
  ) {}

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get avatar(): string { return this._avatar; }
  set avatar(value: string) { this._avatar = value; }

  get joiningTimestamp(): number { return this._joiningTimestamp; }
  set joiningTimestamp(value: number) { this._joiningTimestamp = value; }
}
