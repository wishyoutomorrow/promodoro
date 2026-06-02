export type Etap = "focus" | "shortBreak" | "longBreak"
export interface Mode {
    etap: Etap,
    time: number,
}
export interface MODES extends Record<Etap, number> {
    focus: number,
    shortBreak: number,
    longBreak: number,
    sessionsBetweenBreaks: number,
}


export const DEFAULT_MODES: MODES = {   
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    sessionsBetweenBreaks: 3,
}