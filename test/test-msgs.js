/* Copyright © 2020 Richard Rodger, MIT License */
'use strict'

const MsgTest = require('seneca-msg-test')
const LN = MsgTest.LN

module.exports = {
  print: false,
  test: true,
  fix: 'sys:entity,rig:depend',
  allow: {
    missing: true,
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
      name: 'c01',
      pattern: 'make:child',
      params: {
        parent: '`f01:out`',
      },
      out: {
        ok: true,
        child: { x: 1 },
        parent: { x: 1 },
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
  ],
}
