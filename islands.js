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

root = undefined;


function buildTree(arrPairs) {

    const [first, ...others] = arrPairs;
    root = new Node(first[0], undefined);
    root.childs.push(new Node(first[1], root))
    
    const rest = []
    others.forEach(element => {
        const res = appendToTree(root, element);
        if (res == false)
            rest.push(element);
    });
    console.log(rest);
}

function appendToTree(node, bridge) {
    node.print();
    console.log(`bridge: ${bridge}`);
    const [l, r] = bridge;
    if (node.value == l) {
        node.childs.push(new Node(r, node));
        return true;
    }
    else if (root.value == r) {
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
    const iNumber = rows[0];
    const [count, ...bridges] = rows;
    return bridges.map(v => {
        const [l, r] = v.split(' ');
        const [ln, rn] = [+l, +r];
        return ln < rn ? [ln, rn] : [rn, ln];
    })

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
    const sortedPairs = reorder(parseInput(input));
    buildTree(sortedPairs);
})();