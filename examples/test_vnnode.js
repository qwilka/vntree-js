//

import {VnNode} from '../vntree/vntree.js';

let rootnode = new VnNode("root node");
let node1 = new VnNode("node1 level1", rootnode);
let node11 = new VnNode("node11 level2", node1);
let node12 = new VnNode("node12 level2", node1);
let node13 = new VnNode("node13 level2", node1);
let node121 = new VnNode("node121 level3", node12);
let node122 = new VnNode("node122 level3", node12);
let node2 = new VnNode("node2 (level1)", rootnode);
let node21 = new VnNode("node21 (level2)", node2);
let node211 = new VnNode("node211 (level3)", node21);
let node212 = new VnNode("node212 (level3) parentless");
node21.add_child(node212);
node21.add_child(new VnNode("node213 (level3) parentless"));
let node3 = new VnNode("node3 (level1)", rootnode);

console.log(rootnode.to_texttree());
for (let n of rootnode) console.log(n.name);