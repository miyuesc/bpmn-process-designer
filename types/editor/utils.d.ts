declare module '@/utils/Logger' {
  export class Logger {
    constructor()
    static print(type: string, text: any, back?: boolean): void
    static printBack(type: string, text: any): void
    static pretty(type: any, title: string, ...text: any[]): void
    static prettyPrimary(title: string, ...text: any[]): void
    static prettySuccess(title: string, ...text: any[]): void
    static prettyWarn(title: string, ...text: any[]): void
    static prettyError(title: string, ...text: any[]): void
    static prettyInfo(title: string, ...text: any[]): void
  }
  export default Logger
}
