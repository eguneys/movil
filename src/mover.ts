export interface IMover {
  init(): Promise<void>;
  move(position: string, moves: Array<string>): Promise<string | undefined>
}
