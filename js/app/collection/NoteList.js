var com = com || {};
com.apress = com.apress || {};
com.apress.collection = com.apress.collection || {};

com.apress.collection.NoteList = Backbone.Collection.extend({
  model: com.apress.model.Note,
});
