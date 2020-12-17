declare const intern: {
    parse_entity_id(seneca: any, msg: any, name: string, opts?: any): string;
    resolve_entity_id(seneca: any, msg: any, name: string, opts?: any): Promise<string>;
};
export default intern;
