const FolderService = {
  getAllFolders(db){
    return db('folders')
      .select('*');
  },
  insertFolder(db, newFolder){
    return db('folders')
      .insert(newFolder)
      .returning('*')
      .then(res => res[0]);
  },
  getById(db, id){
    return db('folders')
      .select('*')
      .where({ id })
      .first();
  },
  deleteFolder(db, id){
    return db('folders')
      .where({ id })
      .delete();
  },
  updateFolder(db, id, newFolder){
    return db('folders')
      .where({ id })
      .insert(newFolder);
  }
};

module.exports = FolderService;