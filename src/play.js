const fs = require('fs');
const Category = require('../src/models/Category');


const rawdata = fs.readFileSync(__dirname +'/resources/defaultCategoryTree.json');
const categories = JSON.parse(rawdata).payload;

const categoryDb = [];
traverseChildren(categoryDb, categories, null);
console.log(categoryDb);


function traverseChildren(categoryDb, children, parent){
    if(children.length === 0){
        return;
    }
    children.forEach(child =>{
        const catToAdd = new Category({
            app: "5eadd253370826357045dd9a",
            name: child.title,
        });
        if(parent){
            catToAdd.parent = parent._id;
            parent.children.push(catToAdd._id);
        }
        traverseChildren(categoryDb, child.children, catToAdd)
        categoryDb.push(catToAdd);
    });
}


