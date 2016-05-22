var com = com || {};
com.apress = com.apress || {};
com.apress.collection = com.apress.collection || {};

com.apress.collection.FolderList = Backbone.Collection.extend({
  model: com.apress.model.Folder,
  comparator: 'sortname'
});
