# seneca-entity-depend
Handle dependency relationships on entity verison


[![npm version](https://badge.fury.io/js/%40seneca%2Fentity-depend.svg)](https://badge.fury.io/js/%40seneca%2Fentity-depend)
[!![Build](https://github.com/senecajs/seneca-entity-depend/workflows/build/badge.svg)](https://github.com/senecajs/seneca-entity-depend/actions?query=workflow%3Abuild)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-entity-depend/badge.svg?branch=main)](https://coveralls.io/github/senecajs/seneca-entity-depend?branch=main)
[![Maintainability](https://api.codeclimate.com/v1/badges/0b1990c4264d66b01c50/maintainability)](https://codeclimate.com/github/senecajs/seneca-entity-depend/maintainability)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/14231/branches/259194/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=14231&bid=259194)



## NOTE

* Only works on _@seneca/entity-history_ enabled ents (as per `ent` option of _@seneca/entity-history_).


## Message Tutorial

These can be run interactively with [seneca-repl](senecajs/seneca-repl. 
To use in code, call with `let out = await seneca.post(msg)`.


#### Create some entities
```css
> sys:entity,cmd:save,name:foo,ent:{x:1,y:'Y'} => foo1=out
{ id: <ID>, x: 1, y: 'Y' }
> sys:entity,cmd:save,name:foo,ent:{x:2,y:'YY'} => foo2=out
{ id: <ID>, x: 2, y: 'YY' }
```

#### Create a dependency
```css
> sys:entity,rig:depend,name:foo,make:child,parent_id:`$.foo1.id` => foo1c1=out
{ id: <ID>, x: 1, y: 'Y' }
```

#### Pull latest updates from parent, child's changes have precedence

Pulls all changes from previous pull point (initially the depend point).
Default is to keep child's conflicting changes.

```css
> sys:entity,rig:depend,name:foo,pull:parent,child_id:`$.foo1c1.id` => foo1c1=out
```

#### Pull latest updates from parent, parents's changes have precedence
```css
> sys:entity,rig:depend,name:foo,pull:parent,keep:parent,child_id:`$.foo1c1.id` 
    => foo1c1=out
```

#### Pull latest updates from child

Pulls all changes since previous pull point (initially the depend point).
Default is to keep parent's conflicting changes.

```css
> sys:entity,rig:depend,name:foo,pull:child,parent_id:`$.foo1.id`,child_id:`$.foo1c1.id` 
    => foo1=out
```

Keep child's conflicting changes:
```css
> sys:entity,rig:depend,name:foo,pull:child,keep:child,parent_id:`$.foo1.id`,child_id:`$.foo1c1.id` 
    => foo1=out
```

Parent to child relationship is one-to-many. Thus `pull:child` needs both 
`child_id` and `parent_id`.


#### Generate a pull request

```css
> sys:entity,rig:depend,name:foo,pull:child,make:request,parent_id:`$.foo1.id`,child_id:`$.foo1c1.id` 
    => pr0=out
```

#### Pull request operations

List pull requests against child and parent, as provided
```css
> sys:entity,rig:depend,name:foo,list:request,parent_id?,child_id?
```

Apply a pull request. Same as applying `pull` operation above.
```css
> sys:entity,rig:depend,name:foo,apply:request,request_id
```

#### Preview pull operation

See which fields are changed in parent and child.
```css
> sys:entity,rig:depend,name:foo,pull-preview:parent,child_id:`$.foo1c1.id` => preview1=out
```

#### Pull latest updates from parent, specific version

Pulls all changes from specified version. NOTE: uses _entity-history_ directly

```css
> sys:entity,rig:depend,entity:depend,ent:{name:foo,id:`$.foo1`} => h0=out.items
> sys:entity,rig:depend,name:foo,pull:parent,child_id:`$.foo1c1.id`,
    parent_ver_id:`$.h0[0].id` => foo1c1=out
```


## Implementation

### Entities

* _sys/entdep_: Dependency relationships established with `make:child`
* _sys/pullhist_: Pull history.
* _sys/pullreq_: Pull requests.


## TODO:

* Patterns should support `ent` param as well as top level _base,name,id_.
* Support `make:parent`




