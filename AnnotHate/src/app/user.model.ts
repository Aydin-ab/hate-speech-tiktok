import { Data } from "./data.module";

export interface User {

    uid: string;
    displayName: string;
    email: string;
    admin: boolean;
    annotator: boolean;
    labelledDatas: Data[] | undefined | null;

}