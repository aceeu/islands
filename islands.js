const readline = require('readline');

class Node {
    constructor(value, parent) {
        this.value = value;
        this.parent = parent;
        this.childs = [];
    }
    addChild(value) {
        this.childs.push(new Node(value, this));
    }
    print() {
        console.log(`>> value:${this.value}, childs: ${this.childs.map(c => c.value || '-')}`);
    }
}

function makeRoot([l, r]) {
    const root = new Node(1, undefined);
    root.childs.push(new Node(l != 1 ? l : r, root));
    return root;
}

function splitArray(arrPairs, value) {
    const has = []; // только значения [1, 2,...]
    const hasnt = []; // пары
    for (let i = 0; i < arrPairs.length; ++i) {
        const p = arrPairs[i];
        if (p[0] === value || p[1] === value)
            has.push(p[0] === value ? p[1] : p[0]);
        else
            hasnt.push(p)
    }
    return [has, hasnt];
}

function buildTree(arrPairs) {
    const [first, ...others] = arrPairs;
    const root = makeRoot(first);
    makeChilds(others, root);
    return root;
}

function makeChilds(arrPairs, node) {
    const [has, hasnt] = splitArray(arrPairs, node.value);
    has.forEach(v => node.addChild(v));
    node.childs.forEach(c => makeChilds(hasnt, c));
}

// returs [[1,5], [2,6], ....]
function parseInput(str) {
    const rows = str.split('\n');
    return rows.map(v => {
        const [l, r] = v.split(' ');
        const [ln, rn] = [+l, +r];
        return ln < rn ? [ln, rn] : [rn, ln];
    });
}

// упорядочивает
function reorder(arrPairs) {
    const index = arrPairs.findIndex(v => v[0] == 1 || v[1] == 1);
    if (index == -1)
        throw new Error('invalid bridges');
    const one = arrPairs.splice(index, 1);
    arrPairs.unshift(one[0]);
    return arrPairs;
}

function findDown(node, id, counter = {steps: 0, fn: undefined}, excludedChild = -1) {
    if (node.value == id) {
        counter.fn = node;
        return node;
    }
    for (let i = 0; i < node.childs.length; ++i) {
        const n = node.childs[i];
        if (n.value == excludedChild)
            continue;
        ++counter.steps;
        const fn = findDown(n, id, counter)
        if (fn) {
            counter.fn = fn;
            return fn;
        }
        --counter.steps;
    }

    return undefined;
}

function distance(fromNode, id) {
    const counter = {steps: 0, fn: undefined};
    let upFrom = -1;
    for(;;) {
        const resFindDown = findDown(fromNode, id, counter, upFrom);
        if (resFindDown)
            break;
        // go up
        upFrom = fromNode.value;
        fromNode = fromNode.parent;
        ++counter.steps;
    }
    return counter;
}



function go(input) {
    const data = parseInput(input);
    const count = data.length + 1;
    const sortedPairs = reorder(data);
    const treeRoot = buildTree(sortedPairs);
    let i = 1;
    let bridgesCount = 0;
    let currNode = treeRoot;
    let counter;
    for(; i < count; ++i) {
        counter = distance(currNode, i + 1);
        bridgesCount += counter.steps;
        currNode = counter.fn;
    }
    counter = distance(currNode, 1);
    bridgesCount += counter.steps;
    console.log(bridgesCount); 
}

function tests() {
    const input =
//'8\n\
'5 8\n\
1 3\n\
8 6\n\
7 5\n\
2 8\n\
1 5\n\
4 5';

    const data = parseInput(input);
    const sortedPairs = reorder(data);
    // console.log(sortedPairs);
    const [h, hn] = splitArray(sortedPairs, 1);
    // console.log(h);
    // console.log(hn);
    const root = buildTree(sortedPairs);
    console.log(root.childs[1].childs[0]);
    go(input);
}

function doFromStdIn() {
    const rl = readline.createInterface({
        input: process.stdin,
        terminal: false
    });
    let input = '';
    bridgesNumber = -1;
    rl.on('line', function(line) {
        if (bridgesNumber == -1) {
            bridgesNumber = Number.parseInt(line) - 1;
            return;
        }
        --bridgesNumber;
        input = input.concat(line);
        if (bridgesNumber == 0) {
            rl.close();
        }
        input = input.concat('\n');            

    });
    rl.on('close', () => {
        go(input);
    });
}

 
(function start() {
//   tests();
  doFromStdIn();
})();