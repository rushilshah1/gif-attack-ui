/*Establishing basic framework for Game Setting Features */
export interface ISettings {
    hiddenSubmission?: boolean;
}

export const defaultSettings: ISettings = {
    hiddenSubmission: true
}