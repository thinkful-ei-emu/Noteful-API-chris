function makeNoteArray() {
  return [
    {
      'id': '1354egw',
      'note_name': 'first test note',
      'folders_id': '121a',
      'content': 'true messages'
    },
    {
      'id': '24yhrtw',
      'note_name': 'second test note',
      'folders_id': '12a',
      'content': 'true messages'
    },
    {
      'id': '13htrwh24',
      'note_name': 'third test note',
      'folders_id': '121a',
      'content': 'true messages'
    }
  ];
}

function makeMaliciousNote() {
    const maliciousArticle = {
      id: '911',
      folders_id: '121a',
      note_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
      content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
    }
    const expectedNote = {
      ...maliciousNote,
      note_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
        maliciousNote,
        expectedNote,
    }
}
module.exports = {
    makeMaliciousNote,
    makeNoteArray
}