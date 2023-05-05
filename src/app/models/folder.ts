export interface Folders{
    id?: number | string,
    name: string,
    path: string,
    icon: string,
    subFolder: Folders[],
}
