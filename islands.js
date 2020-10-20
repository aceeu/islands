class Node {
    constructor(value, parent) {
        this.value = value;
        this.parent = parent;
        this.childs = [];
    }
    print() {
        console.log(`>> value:${this.value}, childs: ${this.childs.map(c => c.value || '-')}`);
    }
}

function fill(bridges, root) {
    const rest = [];
    bridges.forEach(element => {
        const res = appendToTree(root, element);
        if (res == false)
            rest.push(element);
    });
    if (rest.length)
        return fill(rest, root);
    return rest;    
}

function buildTree(arrPairs) {
    const [first, ...others] = arrPairs;
    const root = new Node(first[0], undefined);
    root.childs.push(new Node(first[1], root));
    fill(others, root);
    return root;
}

function appendToTree(node, bridge) {
    const res = appendToTreeI(node, bridge);
    // console.log(`append: ${res ? 'ok' : 'fail'}`);
    return res;
}

function appendToTreeI(node, bridge) {
    // node.print();
    // console.log(`bridge: ${bridge}`);
    const [l, r] = bridge;
    if (node.value == l) {
        node.childs.push(new Node(r, node));
        return true;
    }
    else if (node.value == r) {
        node.childs.push(new Node(l, node))
        return true;
    }
    if (node.childs.length == 0)
        return false;
    for (let i = 0; i < node.childs.length; ++i) {
        if (appendToTree(node.childs[i], bridge))
            return true;
    }
    return false;

}

// returs [[1,5], [2,6], ....]
function parseInput(str) {
    const rows = str.split('\n');
    const [count, ...bridges] = rows;
    return [bridges.map(v => {
        const [l, r] = v.split(' ');
        const [ln, rn] = [+l, +r];
        return ln < rn ? [ln, rn] : [rn, ln];
    }), count]

}

// упорядочивает
function reorder(arrPairs) {
    return arrPairs.sort((a, b) => {
        const v  = a[0] - b[0];
        if (v != 0)
            return v;
        return a[1] - b[1];
    });
}

function findNode(root, id) {
    return findDown(root, id);
}

function findDown(node, id, counter = []) {
    if (node.value == id) {
        return node;
    }
    for (let i = 0; i < node.childs.length; ++i) {
        const n = node.childs[i];
        counter.push(n.value);
        const fn = findDown(n, id, counter)
        if (fn)
            return fn;
        counter.pop();
    }

    return undefined;
}

function distance(fromNode, id) {
    const counter = [];
    for(;;) {
        const resFindDown = findDown(fromNode, id, counter);
        if (resFindDown)
            break;
        // go up
        fromNode = fromNode.parent;
        counter.push(fromNode.value);
    }
    return counter;
}

 
(function start() {
    const input =
    '8\n\
5 8\n\
1 3\n\
8 6\n\
7 5\n\
2 8\n\
1 5\n\
4 5';
    const [data, count] = parseInput(input);
    const sortedPairs = reorder(data);
    const treeRoot = buildTree(sortedPairs);
    let i = 1;
    let bridgesCount = 0;
    for(; i < count; ++i) {
        const ds = distance(findNode(treeRoot, i), i + 1);
        console.log(ds);
        bridgesCount += ds.length; 
    }
    const ds = distance(findNode(treeRoot, i), 1);
    console.log(ds);
    bridgesCount += ds.length;
    console.log(`количество переходов равно: ${bridgesCount}`);


    
})();