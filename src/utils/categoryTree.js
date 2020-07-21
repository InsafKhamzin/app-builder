const fs = require('fs').promises;
const Category = require('../models/Category');

const getDefaultCategoryTree = async (appId) => {
    const filePath = __dirname + '/resources/defaultCategoryTree.json';
    const rawdata = await fs.readFile(filePath);
    const categories = JSON.parse(rawdata).payload;

    const categoryDb = [];
    _traverseChildren(appId, categoryDb, categories, null);

    return categoryDb;
}

//recursive traverse through the category tree 
const _traverseChildren = (appId, categoryDb, children, parent) => {
    if (children.length === 0) {
        return;
    }
    children.forEach(child => {
        const catToAdd = new Category({
            app: appId,
            name: child.title,
        });
        if (parent) {
            catToAdd.parent = parent._id;
            parent.children.push(catToAdd._id);
        }
        _traverseChildren(appId, categoryDb, child.children, catToAdd)
        categoryDb.push(catToAdd);
    });
}


module.exports = { getDefaultCategoryTree };