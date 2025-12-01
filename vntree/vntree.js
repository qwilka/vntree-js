
// https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
// https://es-toolkit.dev/reference/object/cloneDeep.html
// https://lodash.com/docs/4.17.15#set
// https://github.com/lodash/lodash/issues/5999  Future of JavaScript Utility Libraries with es-toolkit
// https://es-toolkit.dev/reference/compat/object/set.html 
// https://lodash.com/per-method-packages
// https://www.npmjs.com/package/lodash.set



export class VnNode {
    #childs;
    #data;

    constructor(name=null, parent=null, data=null, treedict=null, _id=null) {
        this.parent = parent;
        this.#childs = [];

        if (treedict) {
            this.#data = treedict.data;
            if (treedict.childs.length) {
                for (let child of treedict.childs) {
                    this.add_child(new VnNode(null, null, null, child)); 
                }
            }
        } else {
            this.#data = data || {};
        }
        if (!this.#data.hasOwnProperty("_vntree")) {
            this.#data._vntree = {};
        }
        if (name) this.name = name;
        if (!this.#data._vntree.hasOwnProperty("_id")) {
          this._id = _id;
        }
        this.layer = null; // group layer is null

        if (parent !== null) parent.add_child(this);

    }

    get name() {
        return this.#data._vntree.name;
    }

    set name(name) {
        this.#data._vntree.name = name;
    }





    get _id() {
        return this.#data._vntree._id;
    }

    set _id(_id=null) {
        this.#data._vntree._id = _id || crypto.randomUUID();
    }


    add_child (newChild) {
        if (!Array.isArray(this.#childs)) {
            this.#childs = [];
        }
        this.#childs.push(newChild)
        newChild.parent = this
    }

    get_child(node=null) {
        if (node === null) {
            return this.#childs;
        } else if (Number.isInteger(node)) {
            if (node >= 0 && node < this.#childs.length) return this.#childs[node];
        } else if (typeof node === 'string') {  
            // else if (_.isString(node)) {
            // https://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string-in-javascript
            let named = this.get_child().filter(n => n.name === node);
            if (named.length === 1) return named[0];
            if (named.length > 1) return named;
        }
        return null;
    }


    get_root() {
        let n = this;
        while (n.parent) {
            n = n.parent
        }
        return n;
    }


    has_data(path){
        return this.#data.hasOwnProperty(path) ? true : false;
    }


    get_data(path=null) {
        if (path===null) return this.#data;
        if (this.has_data(path)) {
            return this.#data[path]
        }
        return null;
    }

    set_data(path, value) {
        // https://stackoverflow.com/questions/54733539/javascript-implementation-of-lodash-set-method
        // https://lodash.com/docs/4.17.15#set
        //let _obj = _.set(this.#data, path, value)
        // simple top-level set only (path the key)
        this.#data[path] = value;
        return true;        
    }


    *walk() {
        yield this;
        for (let child of this.get_child()) {
            yield* child;
        }
    }
    
    [Symbol.iterator]() {
        return this.walk();
    }


    get_node_by_id(id) {
        for (let _n of this) {
            if (_n.id === id) return _n;
        }
    }

    get_node_by_name(path) {
        let names = path.split(".");
        let loc_root = this;
        let target_node;
        do {
            target_node = null;
            for (let _n of loc_root) {
                if (_n.name === names[0]) {
                    target_node = _n;
                    break;
                }
            }
            if (target_node) {
                names.shift();
                loc_root = target_node;
            } else {
                console.warn("VnNode.get_node_by_name: no node found for name:", names[0]);
                break;
            }            
        } while (names.length > 0);
        return target_node;
    }


    to_texttree(tabLevel=-1) {
        let nodetext = "";
        tabLevel += 1;
        for (let i =0; i < tabLevel; i++) {
            nodetext += ".   ";
        }
        nodetext += "|---" + this.name + "\n";  
        for (let child of this.get_child()) {
            nodetext += child.to_texttree(tabLevel);
        }
        return nodetext;
    }



    to_treedict() {
        let treeDict = {};
        treeDict.childs = [];
        treeDict.data = this.#data; 
        for (let child of this.#childs) {
            treeDict.childs.push(child.to_treedict());
        }
        return treeDict;
    }



    to_JSON() {
        let treeDict = this.to_treedict();
        return JSON.stringify(treeDict);
    }


    static from_JSON(jsonStr) {
        let treeDict = JSON.parse(jsonStr);
        let rootnode = new VnNode(null, null, null, treeDict);
        return rootnode;
    }

    clone(clone_ids=false) {
        //let newtree = _.cloneDeep(this);
        let jstr = this.to_JSON();
        let newtree = VnNode.from_JSON(jstr);
        if (!clone_ids) {
            for (let n of newtree) {
                n._id = null;
            }
        }
        return newtree;
    }

    // rekey() {
    //     // https://github.com/blackflux/object-scan
    //     let scanner = objectScan(['**'], { joined: false, rtn:"key" , filterFn: ({value, context}) => value===context});
    //     for (let n of this) {
    //         let old_id = n._id;
    //         let new_id = uuidv4();
    //         n.#data._vntree._id = new_id;
    //         for (let sn of this) {
    //             let idrefpaths = scanner(sn.get_data(), old_id);
    //             for (let path of idrefpaths) {
    //                 sn.set_data(path, new_id);
    //             }
    //         }
    //     }
    // } 



}



