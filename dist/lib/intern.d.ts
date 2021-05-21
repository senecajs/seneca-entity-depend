declare const intern: {
    parse_entity_id(seneca: any, msg: any, name: string, opts?: any): string;
    resolve_entity_id(seneca: any, msg: any, name: string, opts?: any): Promise<string>;
    ensure_version(seneca: any, parent: any): Promise<any>;
};
export default intern;
