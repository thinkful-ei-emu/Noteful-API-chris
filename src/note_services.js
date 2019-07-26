const NoteService ={
  getAllNotes(db){
    return db.select('*').from('notes');
  },
  insertNote(db, newNote){
    return db('notes')
      .insert(newNote)
      .returning('*')
      .then(res => res[0]);
  },
  getById(db, id){
    return db('notes')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteNote(db, id){
    return db('notes')
      .where({ id })
      .delete();
  },
  updateNote(db, id, newNote){
    return db('notes')
      .where({ id })
      .update(newNote);
  }
};

module.exports = NoteService;