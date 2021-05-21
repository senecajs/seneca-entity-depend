/* Copyright © 2020 Richard Rodger, MIT License */
'use strict'

const MsgTest = require('seneca-msg-test')
const LN = MsgTest.LN

module.exports = {
  print: false,
  test: true,
  // log: true,
  fix: 'sys:entity,rig:depend',
  allow: {
    missing: true,
  },
  data: {
    zed: {
      qaz: {
        q01: { id: 'q01', x:1, y:2 },
        q02: { id: 'q02', x:11, y:22 },
        q03: { id: 'q03', x:111, y:222 },
      },
      zaq: {
        z01: { id: 'z01', q:1,   u:2 },
        z02: { id: 'z02', q:11,  u:22  },
        z03: { id: 'z03', q:111, u:222  },
      },
      pog: {
        p01: { id: 'p01', k:1, n:2, qaz_id:'q01' },
        p02: { id: 'p02', k:11, n:22, qaz_id:'q02', zaq_id:'z02' },
        p03: { id: 'p03', k:111, n:222, zaq_id:'z03'  },
        p04: { id: 'p04', k:1111, n:2222 },
      }

    }
  },

  calls: [
    LN({
      name: 'f01',
      // handle upcoming change role:entity->sys:entity
      pattern: 'sys:entity,role:entity,cmd:save,base:zed,name:foo',
      params: {
        ent: {
          id$: 'f01',
          x: 10,
          y: 'y01',
          entity$: '-/zed/foo',
        },
      },
      out: {
        id: 'f01',
        x: 10,
        y: 'y01',
        entity$: '-/zed/foo',
      },
    }),

    LN({
      pattern: 'sys:entity,role:entity,cmd:save,base:zed,name:foo',
      params: {
        ent: {
          id: '`f01:out.id`',
          x: 1,
        },
      },
      out: {},
    }),

    // make child
    LN({
      // print: true,
      name: 'c01',
      pattern: 'make:child',
      params: {
        parent: '`f01:out`',
      },
      out: {
        ok: true,
        child: { x: 1 },
        parent: { x: 1 },
        entdep: { base: 'zed', name: 'foo', parent_id: '`f01:out.id`' },
      },
    }),

    //{ pattern: 'role:mem-store,cmd:dump' },

    LN({
      pattern: 'sys:entity,role:entity,cmd:save,base:zed,name:foo',
      params: {
        ent: {
          id: '`c01:out.child.id`',
          x: 2,
          z: [0],
          // entity$: '-/zed/foo',
        },
      },
      out: {},
    }),

    // { pattern: 'role:mem-store,cmd:dump' },

    /*
    LN({
      pattern: 'sys:entity,role:entity,cmd:save,base:zed,name:foo',
      params: {
        ent: {
          id: '`c01:out.child.id`',
          x: 3,
        },
      },
      out: {},
    }),

    
    { pattern: 'role:mem-store,cmd:dump' },
    

    // change child
    // preview PR
    // change child again
    // preview PR
*/

    //{ pattern: 'role:mem-store,cmd:dump', print: true },

    LN({
      // print: true,
      name: 'cp01',
      pattern: 'make:child',
      params: {
        parent: 'p01',
        base: 'zed',
        name: 'pog',
        child: {
          id$: 'p01c01'
        },
        replace: { k: -1 },
        referents: {
          qaz_id: {
            base: 'zed',
            name: 'qaz',
            replace: { x: -1 },
            child: {
              id$: 'p01c01q01'
            },
          } 
        }
      },
      out: {
        ok: true,
        entdep: {
          parent_id: 'p01',
          base: 'zed',
          name: 'pog',
        },
      },
    }),

    //{ pattern: 'role:mem-store,cmd:dump', print: true },

    LN({
      // print: true,
      name:'cp01pog',
      pattern: 'sys:entity,role:entity,cmd:load,base:zed,name:pog',
      params: {
        id: '`cp01:out.entdep.child_id`',
      },
      out: {
        k: -1,
        n: 2
      },
    }),

    LN({
      // print: true,
      name:'cp01qaz',
      pattern: 'sys:entity,role:entity,cmd:load,base:zed,name:qaz',
      params: {
        id: '`cp01pog:out.qaz_id`',
      },
      out: {
        x: -1,
        y: 2,
      },
    }),

    LN({
      // print: true,
      pattern: 'make:child',
      params: {
        parent: 'p02',
        base: 'zed',
        name: 'pog',
        child: {
          id$: 'p02c01'
        },
        replace: { k: -11 },
        referents: {
          qaz_id: {
            base: 'zed',
            name: 'qaz',
            replace: { x: -11 },
            child: {
              id$: 'p02c01q01'
            },
          }
        }
      },
      out: {
        ok: true,
        entdep: {
          parent_id: 'p02',
          base: 'zed',
          name: 'pog',
        },
      },
    }),

    LN({
      // print: true,
      pattern: 'make:child',
      params: {
        parent: 'p02',
        base: 'zed',
        name: 'pog',
        child: {
          id$: 'p02c02'
        },
        replace: { k: -11 },
        referents: {
          qaz_id: {
            base: 'zed',
            name: 'qaz',
            replace: { x: -11 },
            child: {
              id$: 'p02c02q01'
            },
          },
          zaq_id: {
            base: 'zed',
            name: 'zaq',
            replace: { q: -11 },
            child: {
              id$: 'p02c02z01'
            },
          } 
        }
      },
      out: {
        ok: true,
        entdep: {
          parent_id: 'p02',
          base: 'zed',
          name: 'pog',
        },
      },
    }),

    LN({
      // print: true,
      pattern: 'make:child',
      params: {
        parent: 'p03',
        base: 'zed',
        name: 'pog',
        child: {
          id$: 'p03c01'
        },
        replace: { k: -111 },
        referents: {
          qaz_id: {
            base: 'zed',
            name: 'qaz',
            replace: { x: -111 },
            child: {
              id$: 'p03c01q01'
            },
          },
          zaq_id: {
            base: 'zed',
            name: 'zaq',
            replace: { q: -111 },
            child: {
              id$: 'p03c01z01'
            },
          } 
        }
      },
      out: {
        ok: true,
        entdep: {
          parent_id: 'p03',
          base: 'zed',
          name: 'pog',
        },
      },
    }),

    LN({
      // print: true,
      pattern: 'make:child',
      params: {
        parent: 'p04',
        base: 'zed',
        name: 'pog',
        child: {
          id$: 'p04c01'
        },
        replace: { k: -1111 },
        referents: {
          qaz_id: {
            base: 'zed',
            name: 'qaz',
            replace: { x: -1111 },
            child: {
              id$: 'p04c01q01'
            },
          },
          zaq_id: {
            base: 'zed',
            name: 'zaq',
            replace: { q: -1111 },
            child: {
              id$: 'p04c01z01'
            },
          } 
        }
      },
      out: {
        ok: true,
        entdep: {
          parent_id: 'p04',
          base: 'zed',
          name: 'pog',
        },
      },
    }),

    LN({
      pattern: 'role:mem-store,cmd:dump',
      // print: true,
      out: {
        zed: {
          qaz: {
            q01: { id: 'q01', x: 1, y: 2, 'entity$': '-/zed/qaz' },
            q02: { id: 'q02', x: 11, y: 22, 'entity$': '-/zed/qaz' },
            q03: { id: 'q03', x: 111, y: 222 },
            p01c01q01: { 'entity$': '-/zed/qaz', x: -1, y: 2, id: 'p01c01q01' },
            p02c01q01: { 'entity$': '-/zed/qaz', x: -11, y: 22, id: 'p02c01q01' },
            p02c02q01: { 'entity$': '-/zed/qaz', x: -11, y: 22, id: 'p02c02q01' }
          },
          zaq: {
            z01: { id: 'z01', q: 1, u: 2 },
            z02: { id: 'z02', q: 11, u: 22, 'entity$': '-/zed/zaq' },
            z03: { id: 'z03', q: 111, u: 222, 'entity$': '-/zed/zaq' },
            p02c02z01: { 'entity$': '-/zed/zaq', q: -11, u: 22, id: 'p02c02z01' },
            p03c01z01: { 'entity$': '-/zed/zaq', q: -111, u: 222, id: 'p03c01z01' }
          },
          pog: {
            p01: { id: 'p01', k: 1, n: 2, qaz_id: 'q01', 'entity$': '-/zed/pog' },
            p02: {
              id: 'p02',
              k: 11,
              n: 22,
              qaz_id: 'q02',
              zaq_id: 'z02',
              'entity$': '-/zed/pog'
            },
            p03: {
              id: 'p03',
              k: 111,
              n: 222,
              zaq_id: 'z03',
              'entity$': '-/zed/pog'
            },
            p04: { id: 'p04', k: 1111, n: 2222, 'entity$': '-/zed/pog' },
            p01c01: {
              'entity$': '-/zed/pog',
              k: -1,
              n: 2,
              qaz_id: 'p01c01q01',
              id: 'p01c01'
            },
            p02c01: {
              'entity$': '-/zed/pog',
              k: -11,
              n: 22,
              qaz_id: 'p02c01q01',
              zaq_id: 'z02',
              id: 'p02c01'
            },
            p02c02: {
              'entity$': '-/zed/pog',
              k: -11,
              n: 22,
              qaz_id: 'p02c02q01',
              zaq_id: 'p02c02z01',
              id: 'p02c02'
            },
            p03c01: {
              'entity$': '-/zed/pog',
              k: -111,
              n: 222,
              zaq_id: 'p03c01z01',
              id: 'p03c01'
            },
            p04c01: { 'entity$': '-/zed/pog', k: -1111, n: 2222, id: 'p04c01' }
          },
        }
      },
    }),    
  ],
}
