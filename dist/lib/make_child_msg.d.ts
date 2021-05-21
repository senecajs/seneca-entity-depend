export declare function make_child_msg(this: any, msg: {
    base: string;
    name: string;
    parent: any;
    child?: {
        id$: string;
    };
    replace?: any;
    referents?: {
        [field_name: string]: {
            base: string;
            name: string;
            replace: any;
            child?: {
                id$: string;
            };
        };
    };
}): Promise<any>;
